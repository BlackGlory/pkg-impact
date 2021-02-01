import { readJSON } from 'fs-extra'
import * as path from 'path'
import { CustomError } from '@blackglory/errors'
import { isObject } from '@blackglory/types'
import { getResultPromise } from 'return-style'
import { PackageInfo } from './types'

interface PackageJson {
  name?: string
  dependencies?: { [name: string]: string }
  devDependencies?: { [name: string]: string }
}

export async function parsePackageJson(filename: string): Promise<PackageInfo> {
  const pkg = await getResultPromise<PackageJson>(readJSON(filename))
  if (!pkg) throw new IllegalPackageJson()
  if (!pkg.name) throw new IllegalPackageJson()

  const moduleName = pkg.name
  const rootDir = path.dirname(filename)
  const dependencies: string[] = []
  const devDependencies: string[] = []
  if (isObject(pkg.dependencies)) Object.keys(pkg.dependencies).forEach(x => dependencies.push(x))
  if (isObject(pkg.devDependencies)) Object.keys(pkg.devDependencies).forEach(x => devDependencies.push(x))

  return { moduleName, rootDir, dependencies, devDependencies }
}

export class IllegalPackageJson extends CustomError {}
