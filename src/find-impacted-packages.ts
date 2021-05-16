import { Queue } from '@blackglory/structures'
import { IPackageInfo } from './types'

interface IOptions {
  includeDev: boolean
}

export function findImpactedPackages(
  packages: IPackageInfo[]
, sourcePackageName: string
, { includeDev }: IOptions
): IPackageInfo[] {
  const result: IPackageInfo[] = []
  const checked = new Set<IPackageInfo>()

  const searchQueue = new Queue<IPackageInfo>()
  const neighbors = Array.from(getNeighborsOfLocalPackages(sourcePackageName))
  neighbors.forEach(x => checked.add(x))
  result.push(...neighbors)
  searchQueue.enqueue(...neighbors)

  while (searchQueue.size) {
    const pkg = searchQueue.dequeue()!
    for (const neighbor of getNeighborsOfLocalPackages(pkg.moduleName)) {
      if (!checked.has(neighbor)) {
        checked.add(neighbor)
        result.push(neighbor)
        searchQueue.enqueue(neighbor)
      }
    }
  }

  return result

  function* getNeighborsOfLocalPackages(pkgName: string): Iterable<IPackageInfo> {
    yield* packages.filter(isDependsOn(pkgName))
    if (includeDev) yield* packages.filter(isDevDependsOn(pkgName))
  }
}

function isDependsOn(pkgName: string): (pkg: IPackageInfo) => boolean {
  return (pkg: IPackageInfo) => {
    for (const dep of pkg.dependencies) {
      if (dep === pkgName) return true
    }
    return false
  }
}

function isDevDependsOn(pkgName: string): (pkg: IPackageInfo) => boolean {
  return (pkg: IPackageInfo) => {
    for (const dep of pkg.devDependencies) {
      if (dep === pkgName) return true
    }
    return false
  }
}
