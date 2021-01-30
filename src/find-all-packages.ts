import * as path from 'path'
import { findAllDirnames, isFile, isReadable } from 'extra-filesystem'
import { toArrayAsync } from 'iterable-operator'
import { map, filter } from 'extra-promise'
import { parsePackageJson, IllegalPackageJson, PackageInfo } from './parse-package-json'
import { isFilled } from 'ts-is-present'

export async function findAllPackages(root: string): Promise<PackageInfo[]> {
  const possibleProjectDirnames = [root, ...await toArrayAsync(findAllDirnames(root, isPossibleProject))]
  const projectDirnames = await filter(possibleProjectDirnames, hasPackageJson)
  const packageFilenames = projectDirnames.map(x => path.join(x, 'package.json'))
  const result = await map(packageFilenames, async filename => {
    try {
      return await parsePackageJson(filename)
    } catch (e) {
      if (e instanceof IllegalPackageJson) return null
      throw e
    }
  })
  return result.filter((isFilled))
}

async function hasPackageJson(dirname: string): Promise<boolean> {
  const packageFilename = path.join(dirname, 'package.json')
  return await isReadable(packageFilename)
      && await isFile(packageFilename)
}

function isPossibleProject(dirname: string) {
  if (inNodeModules(dirname)) return false
  if (inDotGit(dirname)) return false
  return true
}

function inNodeModules(dir: string): boolean {
  return splitPath(dir).includes('node_modules')
}

function inDotGit(dir: string): boolean {
  return splitPath(dir).includes('.git')
}

function splitPath(pathname: string): string[] {
  return path.resolve(pathname).split('/')
}
