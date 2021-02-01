import { map, promisify } from 'extra-promise'
import { parsePackageJson, IllegalPackageJson } from './parse-package-json'
import { isFilled } from 'ts-is-present'
import { PackageInfo } from './types'
import { glob } from 'glob'

const find = promisify<string[]>(glob)

export async function findAllLocalPackages(root: string): Promise<PackageInfo[]> {
  const packageFilenames = await find('**/package.json', {
    cwd: root
  , ignore: ['**/node_modules/**', '**/.git/**']
  , absolute: true
  })
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
