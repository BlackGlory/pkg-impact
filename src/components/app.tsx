import React, { useState, useLayoutEffect } from 'react'
import Cytoscape from 'cytoscape'
import CytoscapeComponent from 'react-cytoscapejs'
import styled from 'styled-components'
import { createCytoscapeElements } from '@src/create-cytoscape-elements'
import * as Serialization from '@src/serialization'
// @ts-ignore
import dagre from 'cytoscape-dagre'
// @ts-ignore
import klay from 'cytoscape-klay'

Cytoscape.use(dagre)
Cytoscape.use(klay)

const CytoscapeStyledComponent = styled(CytoscapeComponent)`
  width: 100%;
  height: 100%;
`

export const App: React.FC = () => {
  const [elements, setElements] = useState<cytoscape.ElementDefinition[]>([])
  const layoutOptions: cytoscape.LayoutOptions = {
    // name: 'dagre'
    name: 'klay'
  }

  useLayoutEffect(() => {
    ;(async () => {
      const text = await fetch('/data').then(res => res.text())
      const pkgList = Serialization.parse<PackageInfo[]>(text)
      setElements(createCytoscapeElements(pkgList))
    })()
  }, [])

  return <div>
    <CytoscapeStyledComponent
      cy={cy => {
        cy.on('resize', _evt => {
          cy.layout(layoutOptions).run()
          cy.fit()
        })
      }}
      elements={elements}
      stylesheet={[
        {
          selector: 'node',
          style: {
            'label': 'data(id)'
          }
        }
      , {
          selector: 'edge',
          style: {
            'width': 3,
            'source-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ]}
    ></CytoscapeStyledComponent>
  </div>
}
