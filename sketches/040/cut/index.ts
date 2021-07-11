import SimplexNoise from 'simplex-noise'
import Voronoi, { Diagram, Edge } from 'voronoi'
import { Cut } from 'types'
import Vector2 from 'utils/Vector2'
import {
  EdgeType,
  getAvoidPoints,
  getEdgeData,
  getNextContinuingEdge,
  getStartingEdge,
} from './utils'
import { MIN_TAB_DIST } from './constants'
import { getMinDistBetweenPointSets } from 'utils/vectorUtils'

export enum Seeds {
  SwayX,
  SwayY,
  Flip,
}

const voronoi = new Voronoi()
let diagram: Diagram

const tweakDist = (
  m: number,
  alt: number,
  rows: number,
  simplex: SimplexNoise
) => {
  // thin out the tweaks towards the edges
  const edgeAvoidanceScalar =
    1 - Math.pow(Math.abs((m - rows / 2) / (rows / 2)), 5) * 0.5
  return (
    (m +
      (simplex.noise2D(m * 0.15, alt * 0.15) * 0.4 +
        simplex.noise2D(m * 0.4, alt * 0.4) * 0.8) *
        edgeAvoidanceScalar) /
    rows
  )
}

interface PointType {
  x: number
  y: number
  rows: number
  columns: number
  simplexX: SimplexNoise
  simplexY: SimplexNoise
  width: number
  height: number
}

class Point extends Vector2 {
  constructor({
    x,
    y,
    rows,
    columns,
    simplexX,
    simplexY,
    width,
    height,
  }: PointType) {
    super()
    this.x = tweakDist(x, y, columns, simplexX) * width
    this.y = tweakDist(y, x, rows, simplexY) * height
  }
}

const drawEdge = ({
  c,
  edge,
  moveTo,
  reverse,
}: {
  c: CanvasRenderingContext2D
  edge: Edge
  moveTo: boolean
  reverse: boolean
}) => {
  edge.drawn = true

  const { pos, edgeType } = edge.data

  const Start = reverse ? 1 : 0
  const End = reverse ? 0 : 1

  if (moveTo) {
    c.moveTo(pos[Start].x, pos[Start].y)
  }

  if (edgeType === EdgeType.Straight) {
    c.lineTo(pos[End].x, pos[End].y)
    return
  }

  if (edgeType === EdgeType.Curve) {
    const { anchorPos } = edge.data

    c.bezierCurveTo(
      anchorPos[Start].x,
      anchorPos[Start].y,
      anchorPos[End].x,
      anchorPos[End].y,
      pos[End].x,
      pos[End].y
    )
    return
  }

  const { hasWings, bezierPos, anchorPos, tabPos, tabAnchorPos } = edge.data

  if (hasWings) {
    c.lineTo(bezierPos[Start].x, bezierPos[Start].y)
  }

  c.bezierCurveTo(
    anchorPos[Start].x,
    anchorPos[Start].y,
    tabAnchorPos[Start].x,
    tabAnchorPos[Start].y,
    tabPos.x,
    tabPos.y
  )
  c.bezierCurveTo(
    tabAnchorPos[End].x,
    tabAnchorPos[End].y,
    anchorPos[End].x,
    anchorPos[End].y,
    bezierPos[End].x,
    bezierPos[End].y
  )

  if (hasWings) {
    c.lineTo(pos[End].x, pos[End].y)
  }
}

const getCutData = ({
  width,
  columns,
  height,
  rows,
  simplex,
}: Cut): Diagram => {
  const sites: Point[] = []

  for (let x = 0.5; x < columns; x++) {
    for (let y = 0.5; y < rows; y++) {
      sites.push(
        new Point({
          x,
          y,
          rows,
          columns,
          simplexX: simplex[Seeds.SwayX],
          simplexY: simplex[Seeds.SwayY],
          width,
          height,
        })
      )
    }
  }

  voronoi.recycle(diagram)
  const bbox = { xl: 0, xr: width, yt: 0, yb: height }
  diagram = voronoi.compute(sites, bbox)

  const allAvoidPoints: Vector2[] = []
  diagram.edges.forEach((edge, i) => {
    const { lSite, rSite } = edge

    let flipTab =
      simplex[Seeds.Flip].noise2D(
        lSite?.voronoiId * 10,
        rSite?.voronoiId * 10
      ) > 0

    const edgeData = getEdgeData({
      edge,
      simplex: simplex[Seeds.Flip],
      flipTab,
    })
    const avoidPoints = getAvoidPoints(edgeData)
    diagram.edges[i].data = edgeData
    if (edgeData.edgeType !== EdgeType.Tab) {
      allAvoidPoints.push(...avoidPoints)
      return
    }

    const minDistToTab = getMinDistBetweenPointSets(avoidPoints, allAvoidPoints)

    if (minDistToTab < MIN_TAB_DIST) {
      const edgeDataAlt = getEdgeData({
        edge,
        simplex: simplex[Seeds.Flip],
        flipTab: !flipTab,
      })
      if (edgeDataAlt.edgeType !== EdgeType.Tab) return // ts sigh
      const avoidPointsAlt = getAvoidPoints(edgeDataAlt)

      const minDistToTabAlt = getMinDistBetweenPointSets(
        avoidPointsAlt,
        allAvoidPoints
      )

      if (minDistToTabAlt > minDistToTab) {
        diagram.edges[i].data = edgeDataAlt
      }
    }

    allAvoidPoints.push(...getAvoidPoints(edgeData))
  })

  return diagram
}

export const cut = (cutArgs: Cut) => {
  const { c, width, height } = cutArgs

  c.beginPath()
  c.moveTo(0, 0)
  c.lineTo(width, 0)
  c.lineTo(width, height)
  c.lineTo(0, height)
  c.lineTo(0, 0)
  c.stroke()

  const data = getCutData(cutArgs)

  // mark jigsaw edges as already drawn
  data.edges.forEach((edge, i) => {
    data.edges[i].drawn = !edge.lSite || !edge.rSite
  })

  // keep track of undrawn for performance
  let undrawnEdges: Edge[] = data.edges
  const updateUndrawnEdges = () =>
    (undrawnEdges = undrawnEdges.filter(({ drawn }) => !drawn))
  updateUndrawnEdges()

  let startingEdge = getStartingEdge(undrawnEdges)
  while (startingEdge) {
    c.beginPath()

    drawEdge({
      c,
      edge: startingEdge.edge,
      moveTo: true,
      reverse: startingEdge.reverse,
    })

    updateUndrawnEdges()

    let nextEdge = getNextContinuingEdge(
      { edge: startingEdge.edge, reverse: startingEdge.reverse },
      undrawnEdges
    )
    while (nextEdge) {
      drawEdge({
        c,
        edge: nextEdge.edge,
        moveTo: false,
        reverse: nextEdge.reverse,
      })
      nextEdge = getNextContinuingEdge(nextEdge, undrawnEdges)
    }

    c.stroke()
    startingEdge = getStartingEdge(undrawnEdges)
  }
}

export const cutPieces = (cutArgs: Cut) => {
  const { c } = cutArgs

  const diagram = getCutData(cutArgs)

  diagram.cells.forEach((cell) => {
    c.beginPath()

    cell.halfedges.forEach((halfEdge, i) => {
      const edgeAngle = Math.atan2(
        halfEdge.edge.vb.y - halfEdge.edge.va.y,
        halfEdge.edge.vb.x - halfEdge.edge.va.x
      )
      // we don't know if the points of the edge are going in the direction of the halfedge
      // the half edge angle is perpendicular to the edge, going counterclockwise
      // so we have to add half a PI to orient it
      // it might be either side of 0, so we add 2PI and modulus 2PI
      // and allow a 0.01 buffer
      const reverse =
        (edgeAngle - halfEdge.angle + Math.PI * 2.5 + 0.01) % (Math.PI * 2) >
        0.02
      drawEdge({
        c,
        edge: halfEdge.edge,
        moveTo: i === 0,
        reverse,
      })
    })
    c.stroke()
  })
}
