import { Edge } from 'voronoi'

export interface DirectionalEdge {
  edge: Edge
  reverse: boolean
}

const getContinuingEdges = (
  prev: DirectionalEdge,
  edges: Edge[]
): DirectionalEdge[] => {
  const availableEdges = edges.filter(
    (edge) => !edge.drawn && prev.edge !== edge
  )

  const a = prev.edge
  const aV = prev.reverse ? a.va : a.vb

  return availableEdges
    .filter((b) => aV === b.va || aV === b.vb)
    .map((b) => ({ edge: b, reverse: aV === b.vb }))
}

export const getNextContinuingEdge = (
  prev: DirectionalEdge,
  edges: Edge[]
): DirectionalEdge | null => {
  const edgeOptions = getContinuingEdges(prev, edges)

  if (edgeOptions.length) {
    // for some reason the last one is always going in the right direction
    // let's not jinx it
    return edgeOptions[edgeOptions.length - 1]
  }

  return null
}

export const getStartingEdge = (edges: Edge[]): DirectionalEdge | null => {
  const undrawnEdges = edges.filter(({ drawn }) => !drawn)

  const startingEdge = undrawnEdges
    .sort((a, b) =>
      // natural order is top to bottom
      // but we want the first row to be left-to-right
      a.va.y === 0 || a.vb.y === 0
        ? Math.min(a.va.x, a.vb.x) - Math.min(b.va.x, b.vb.x)
        : 0
    )
    .find(
      (a) =>
        // if there's no onward travel in either direction
        // it's the start of a line
        getContinuingEdges({ edge: a, reverse: false }, edges).length === 0 ||
        getContinuingEdges({ edge: a, reverse: true }, edges).length === 0
    )

  if (startingEdge) {
    return {
      edge: startingEdge,
      reverse:
        getContinuingEdges({ edge: startingEdge, reverse: false }, edges)
          .length === 0,
    }
  }

  return null
}
