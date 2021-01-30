import { readJSON } from 'fs-extra'
import * as path from 'path'
import { CustomError } from '@blackglory/errors'
import { isObject } from '@blackglory/types'
import { getResultPromise } from 'return-style'

interface PackageJson {
  name?: string
  dependencies?: { [name: string]: string }
  devDependencies?: { [name: string]: string }
}

export interface PackageInfo {
  moduleName: string
  rootDir: string
  dependencies: Set<string>
}

export async function parsePackageJson(filename: string): Promise<PackageInfo> {
  const pkg = await getResultPromise<PackageJson>(readJSON(filename))
  if (!pkg) throw new IllegalPackageJson()
  if (!pkg.name) throw new IllegalPackageJson()

  const moduleName = pkg.name
  const rootDir = path.dirname(filename)
  const dependencies = new Set<string>()
  if (isObject(pkg.dependencies)) Object.keys(pkg.dependencies).forEach(x => dependencies.add(x))
  if (isObject(pkg.devDependencies)) Object.keys(pkg.devDependencies).forEach(x => dependencies.add(x))

  return { moduleName, rootDir, dependencies }
}

export class IllegalPackageJson extends CustomError {}
