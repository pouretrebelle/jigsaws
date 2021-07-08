import SimplexNoise from 'simplex-noise'
import Voronoi, { Diagram } from 'voronoi'
import { Cut } from 'types'
import Vector2 from 'utils/Vector2'

export enum Seeds {
  SwayX,
  SwayY,
  Flip,
}

const MIN_TAB_SIZE = 8
const MAX_TAB_SIZE = 12

const voronoi = new Voronoi();
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

const drawEdge = (
  c: CanvasRenderingContext2D,
  p1: Vector2,
  p2: Vector2,
  flip: boolean,
  moveTo: boolean,
  straight?: boolean
) => {
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
  const pAng = Math.atan(1 / 8) * flipMult // how far p1c and p2c lean back from tab

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
  const t = midPoint.plusNew(tV) // top point of tab

  const p1c = p1s.plusNew(pV.multiplyNew(pWidth).rotate(pAng))
  const t1 = t.minusNew(pV.multiplyNew(tWidth / 2))
  const t2 = t.plusNew(pV.multiplyNew(tWidth / 2))
  const p2c = p2s.minusNew(pV.multiplyNew(pWidth).rotate(-pAng))

  c.bezierCurveTo(p1c.x, p1c.y, t1.x, t1.y, t.x, t.y)
  c.bezierCurveTo(t2.x, t2.y, p2c.x, p2c.y, p2s.x, p2s.y)

  if (needsWings) {
    c.lineTo(p2.x, p2.y)
  }
}

export const cut = (cutArgs: Cut) => {
  const { c, width, columns, height, rows, simplex } = cutArgs

  c.beginPath()
  c.moveTo(0, 0)
  c.lineTo(width, 0)
  c.lineTo(width, height)
  c.lineTo(0, height)
  c.lineTo(0, 0)
  c.stroke()

  const sites: Point[] = []

  for (let x = 0.5; x < columns; x++) {
    for (let y = 0.5; y < rows; y++) {
      sites.push(new Point({
        x,
        y,
        rows,
        columns,
        simplexX: simplex[Seeds.SwayX],
        simplexY: simplex[Seeds.SwayY],
        width,
        height,
      }))
    }
  }

  voronoi.recycle(diagram);
  const bbox = { xl: 0, xr: width, yt: 0, yb: height };
  diagram = voronoi.compute(sites, bbox);

  c.beginPath()
  diagram.edges.forEach(({ lSite, rSite, va, vb }) => {
    // don't draw edges
    if (!lSite || !rSite) return

    const p1 = new Vector2(va.x, va.y)
    const p2 = new Vector2(vb.x, vb.y)

    const edgeLength = p1.dist(p2)
    const flip = simplex[Seeds.Flip].noise2D(lSite.voronoiId * 10, rSite.voronoiId * 10) > 0

    drawEdge(c, p1, p2, flip, true, edgeLength < MIN_TAB_SIZE)
  })
  c.stroke()
}

export const cutPieces = (cutArgs: Cut) => {
}
