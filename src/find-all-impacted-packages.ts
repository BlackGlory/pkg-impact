import { Queue } from '@blackglory/structures'
import { PackageInfo } from './types'

export function findAllImpactedLocalPackages(sourcePakgeName: string, localPackages: PackageInfo[]): PackageInfo[] {
  const result: PackageInfo[] = []
  const checked = new Set<PackageInfo>()

  const searchQueue = new Queue<PackageInfo>()
  const neighbors = Array.from(getNeighborsOfLocalPackages(sourcePakgeName))
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

  function getNeighborsOfLocalPackages(pkgName: string): PackageInfo[] {
    return localPackages.filter(isDependsOn(pkgName))
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
