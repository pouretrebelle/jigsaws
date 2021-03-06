import SimplexNoise from 'simplex-noise'
import Voronoi, { Diagram, Edge } from 'voronoi'
import { Cut } from 'types'
import Vector2 from 'utils/Vector2'
import { getNextContinuingEdge, getStartingEdge } from './utils'
import { map, signFromRandom } from 'utils/numberUtils'

export enum Seeds {
  SwayX,
  SwayY,
  Flip,
}

const MIN_TAB_SIZE = 6
const MAX_TAB_SIZE = 10

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
        simplex.noise2D(m * 0.4, alt * 0.4) * 0.2) *
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
  simplex,
  edge,
  moveTo,
  reverse,
}: {
  c: CanvasRenderingContext2D
  simplex: SimplexNoise
  edge: Edge
  moveTo: boolean
  reverse: boolean
}) => {
  const { lSite, rSite, va, vb } = edge
  edge.drawn = true
  const points = [new Vector2(va.x, va.y), new Vector2(vb.x, vb.y)]
  if (reverse) points.reverse()
  const p1 = points[0]
  const p2 = points[1]

  const straight = !lSite || !rSite
  const noTab = points[0].dist(points[1]) < MIN_TAB_SIZE
  let flip = straight
    ? false
    : simplex.noise2D(lSite.voronoiId * 10, rSite.voronoiId * 10) > 0
  if (reverse) flip = !flip

  if (moveTo) c.moveTo(p1.x, p1.y)

  if (straight) {
    return c.lineTo(p2.x, p2.y)
  }

  const dist = p1.dist(p2)
  const needsWings = dist > MAX_TAB_SIZE
  const flipMult = flip ? -1 : 1

  const tVmult = 0.4 * flipMult // push of t towards other side of piece
  const tWidth = 1.1 // how far t1 and t2 are from the center
  const pWidth = 0.85 // how far p1c and p2c are from the p1s and p2s
  const pAng =
    Math.atan(
      map(
        MAX_TAB_SIZE / dist,
        2,
        MIN_TAB_SIZE / MAX_TAB_SIZE,
        1 / 2,
        1 / 8,
        true
      )
    ) * flipMult // how far p1c and p2c lean back from tab
  const tAng = map(
    simplex.noise2D(123 + lSite.voronoiId * 10, 345 + rSite.voronoiId * 10),
    -1,
    1,
    -0.2,
    0.2
  )

  if (noTab) {
    const cSimp = simplex.noise2D(
      123 + lSite.voronoiId * 10,
      345 + rSite.voronoiId * 10
    )
    const cAng =
      map(cSimp, -1, 1, 0.5, 0.8) * signFromRandom((cSimp * 100) % 1) * flipMult
    const cV = p2.minusNew(p1) // vector from p1 to p2
    const c1 = p1.plusNew(cV.multiplyNew(0.35).rotate(cAng))
    const c2 = p2.plusNew(cV.multiplyNew(-0.35).rotate(-cAng))

    return c.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p2.x, p2.y)
  }

  // the starting points of this tabs
  let p1s = p1.clone()
  let p2s = p2.clone()

  if (needsWings) {
    const pVUnit = p2.minusNew(p1).normalise()
    const wingDist = (dist - MAX_TAB_SIZE) / 2 / Math.cos(pAng)
    p1s.plusEq(pVUnit.multiplyNew(wingDist).rotate(pAng))
    p2s.minusEq(pVUnit.multiplyNew(wingDist).rotate(-pAng))

    c.lineTo(p1s.x, p1s.y)
  }

  const midPoint = p1s.plusNew(p2s).multiplyEq(0.5)
  const pV = p2s.minusNew(p1s) // vector from p1s to p2s
  const tV = pV.multiplyNew(tVmult).rotate(-90, true) // perpendicular to pV
  const ptV = pV.clone().rotate(tAng) // tweak tab angles
  const t = midPoint.plusNew(tV) // top point of tab

  const p1c = p1s.plusNew(pV.multiplyNew(pWidth).rotate(pAng))
  const t1 = t.minusNew(ptV.multiplyNew(tWidth / 2))
  const t2 = t.plusNew(ptV.multiplyNew(tWidth / 2))
  const p2c = p2s.minusNew(pV.multiplyNew(pWidth).rotate(-pAng))

  c.bezierCurveTo(p1c.x, p1c.y, t1.x, t1.y, t.x, t.y)
  c.bezierCurveTo(t2.x, t2.y, p2c.x, p2c.y, p2s.x, p2s.y)

  if (needsWings) {
    c.lineTo(p2.x, p2.y)
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
  return voronoi.compute(sites, bbox)
}

export const cut = (cutArgs: Cut) => {
  const { c, width, height, simplex } = cutArgs

  c.beginPath()
  c.moveTo(0, 0)
  c.lineTo(width, 0)
  c.lineTo(width, height)
  c.lineTo(0, height)
  c.lineTo(0, 0)
  c.stroke()

  const diagram = getCutData(cutArgs)

  // mark jigsaw edges as already drawn
  diagram.edges.forEach((edge, i) => {
    diagram.edges[i].drawn = !edge.lSite || !edge.rSite
  })

  // keep track of undrawn for performance
  let undrawnEdges: Edge[] = diagram.edges
  const updateUndrawnEdges = () =>
    (undrawnEdges = undrawnEdges.filter(({ drawn }) => !drawn))
  updateUndrawnEdges()

  let startingEdge = getStartingEdge(undrawnEdges)
  while (startingEdge) {
    c.beginPath()

    drawEdge({
      c,
      simplex: simplex[Seeds.Flip],
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
        simplex: simplex[Seeds.Flip],
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
  const { c, simplex } = cutArgs

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
        simplex: simplex[Seeds.Flip],
        edge: halfEdge.edge,
        moveTo: i === 0,
        reverse,
      })
    })
    c.stroke()
  })
}
