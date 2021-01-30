import CytoscapeComponent from 'react-cytoscapejs'

export function createCytoscapeElements(pkgList: PackageInfo[]): cytoscape.ElementDefinition[] {
  const nodes: cytoscape.ElementDefinition[] = []
  const edges: cytoscape.ElementDefinition[] = []

  const modules = new Set<string>()
  for (const pkg of pkgList) {
    nodes.push({
      data: {
        id: pkg.moduleName
      , label: pkg.moduleName
      }
    })
    modules.add(pkg.moduleName)
  }

  for (const pkg of pkgList) {
    for (const dependency of pkg.dependencies.keys()) {
      if (modules.has(dependency)) {
        edges.push({
          data: {
            source: pkg.moduleName
          , target: dependency
          }
        })
      }
    }
  }

  return CytoscapeComponent.normalizeElements({ nodes, edges })
}
