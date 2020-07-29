import SimplexNoise from 'simplex-noise'
import { Cut } from 'types'
import Vector2 from 'utils/Vector2'

const tweakDist = (
  m: number,
  alt: number,
  rows: number,
  simplex: SimplexNoise
) => {
  const edgeAvoidanceScalar =
    1 - Math.pow(Math.abs((m - rows / 2) / (rows / 2)), 5)
  return (
    (m +
      (simplex.noise2D(m * 0.15, alt * 0.15) * 0.2 +
        simplex.noise2D(m * 0.4, alt * 0.4) * 0.1) *
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

const addToCurves = (
  c: CanvasRenderingContext2D,
  p1: Vector2,
  p2: Vector2,
  flip: boolean
) => {
  const tVmult = 0.25 // push of t towards other side of piece
  const tVdiv = 0.4 // push of p1c and p2c away from other side of piece
  const tWidth = 0.7 // how far t1 and t2 are from the canter
  const pWidth = 0.8 // how far p1x and p2c are from the center

  const midPoint = p1.plusNew(p2).multiplyEq(0.5)
  const pV = p2.minusNew(p1) // vector from p1 to p2
  const tV = pV.multiplyNew(tVmult).rotate(flip ? 90 : -90, true) // perpendicular to pV
  const t = midPoint.plusNew(tV) // top point of divet

  const p1c = p1.plusNew(pV.multiplyNew(pWidth)).minusEq(tV.multiplyNew(tVdiv))
  const t1 = t.minusNew(pV.multiplyNew(tWidth / 2))
  const t2 = t.plusNew(pV.multiplyNew(tWidth / 2))
  const p2c = p2.minusNew(pV.multiplyNew(pWidth)).minusEq(tV.multiplyNew(tVdiv))

  c.moveTo(p1.x, p1.y)
  c.bezierCurveTo(p1c.x, p1c.y, t1.x, t1.y, t.x, t.y)
  c.bezierCurveTo(t2.x, t2.y, p2c.x, p2c.y, p2.x, p2.y)
}

export const cut = ({ c, width, columns, height, rows, seed }: Cut) => {
  c.beginPath()
  c.moveTo(0, 0)
  c.lineTo(width, 0)
  c.lineTo(width, height)
  c.lineTo(0, height)
  c.lineTo(0, 0)
  c.stroke()

  const simplex0 = new SimplexNoise(seed[0])
  const simplex1 = new SimplexNoise(seed[1])
  const simplex2 = new SimplexNoise(seed[2])
  const simplex3 = new SimplexNoise(seed[3])
  const crossPoints = [] as Point[][]

  for (let x = 0; x < columns + 1; x++) {
    if (!crossPoints[x]) crossPoints.push([])
    for (let y = 0; y < rows + 1; y++) {
      crossPoints[x][y] = new Point({
        x,
        y,
        rows,
        columns,
        simplexX: simplex0,
        simplexY: simplex1,
        width,
        height,
      })
    }
  }

  // vertical
  for (let x = 0; x < columns; x++) {
    c.beginPath()
    for (let y = 0; y < rows; y++) {
      const corner = crossPoints[x + 1][y + 1]
      const right = crossPoints[x + 1][y]

      if (x < columns - 1) {
        addToCurves(c, right, corner, simplex2.noise2D(x * 2, y * 2) < 0)
      }
    }
    c.stroke()
  }

  // horizontal
  for (let y = 0; y < rows; y++) {
    c.beginPath()
    for (let x = 0; x < columns; x++) {
      const left = crossPoints[x][y + 1]
      const corner = crossPoints[x + 1][y + 1]

      if (y < rows - 1) {
        addToCurves(c, left, corner, simplex3.noise2D(x * 2, y * 2) < 0)
      }
    }
    c.stroke()
  }
}

export default cut
