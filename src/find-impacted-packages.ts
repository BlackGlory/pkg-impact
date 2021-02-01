import { Queue } from '@blackglory/structures'
import { PackageInfo } from './types'

interface Options {
  includeDev: boolean
}

export function findImpactedPackages(packages: PackageInfo[], sourcePackageName: string, { includeDev }: Options): PackageInfo[] {
  const result: PackageInfo[] = []
  const checked = new Set<PackageInfo>()

  const searchQueue = new Queue<PackageInfo>()
  const neighbors = Array.from(getNeighborsOfLocalPackages(sourcePackageName))
  neighbors.forEach(x => checked.add(x))
  result.push(...neighbors)
  searchQueue.enqueue(...neighbors)

  while (searchQueue.size) {
    const pkg = searchQueue.dequeue()
    for (const neighbor of getNeighborsOfLocalPackages(pkg.moduleName)) {
      if (!checked.has(neighbor)) {
        checked.add(neighbor)
        result.push(neighbor)
        searchQueue.enqueue(neighbor)
      }
    }
  }

  return result

  function* getNeighborsOfLocalPackages(pkgName: string): Iterable<PackageInfo> {
    yield* packages.filter(isDependsOn(pkgName))
    if (includeDev) yield* packages.filter(isDevDependsOn(pkgName))
  }
}

function isDependsOn(pkgName: string): (pkg: PackageInfo) => boolean {
  return (pkg: PackageInfo) => {
    for (const dep of pkg.dependencies) {
      if (dep === pkgName) return true
    }
    return false
  }
}

function isDevDependsOn(pkgName: string): (pkg: PackageInfo) => boolean {
  return (pkg: PackageInfo) => {
    for (const dep of pkg.devDependencies) {
      if (dep === pkgName) return true
    }
    return false
  }
}
