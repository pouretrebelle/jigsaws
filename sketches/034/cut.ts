import SimplexNoise from 'simplex-noise'
import { Cut } from 'types'
import { randomFromNoise } from 'utils/numberUtils'
import Vector2 from 'utils/Vector2'

export enum Seeds {
  SwayX,
  SwayY,
  FlipX,
  FlipY,
  Holes,
}

const HOLE_COUNT = 7

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
  flip: boolean,
  moveTo: boolean,
  straight?: boolean
) => {
  if (moveTo) c.moveTo(p1.x, p1.y)

  if (straight) {
    return c.lineTo(p2.x, p2.y)
  }

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

  c.bezierCurveTo(p1c.x, p1c.y, t1.x, t1.y, t.x, t.y)
  c.bezierCurveTo(t2.x, t2.y, p2c.x, p2c.y, p2.x, p2.y)
}

export const cut = ({ c, width, columns, height, rows, simplex }: Cut) => {
  c.beginPath()
  c.moveTo(0, 0)
  c.lineTo(width, 0)
  c.lineTo(width, height)
  c.lineTo(0, height)
  c.lineTo(0, 0)
  c.stroke()

  let holes: {
    row: number
    column: number
  }[] = []
  for (let i = 0; i < HOLE_COUNT; i++) {
    const row = Math.floor(1 + randomFromNoise(simplex[Seeds.Holes].noise2D(i * 2, Math.PI)) * (rows - 2))
    const column = Math.floor(1 + randomFromNoise(simplex[Seeds.Holes].noise2D(Math.PI, i * 2)) * (columns - 2))
    holes.push({ row, column })
  }

  const crossPoints = [] as Point[][]

  for (let x = 0; x < columns + 1; x++) {
    if (!crossPoints[x]) crossPoints.push([])
    for (let y = 0; y < rows + 1; y++) {
      crossPoints[x][y] = new Point({
        x,
        y,
        rows,
        columns,
        simplexX: simplex[Seeds.SwayX],
        simplexY: simplex[Seeds.SwayY],
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
        addToCurves(
          c,
          right,
          corner,
          simplex[Seeds.FlipX].noise2D(x * 2, y * 2) < 0,
          true,
          holes.some(({ row, column }) => (column === x || column - 1 === x) && row === y)
        )
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
        addToCurves(
          c,
          left,
          corner,
          simplex[Seeds.FlipY].noise2D(x * 2, y * 2) < 0,
          true,
          holes.some(({ row, column }) => (column === x) && (row === y || row - 1 === y))
        )
      }
    }
    c.stroke()
  }
}

export const cutPieces = ({
  c,
  width,
  columns,
  height,
  rows,
  simplex,
}: Cut) => {
  const crossPoints = [] as Point[][]

  for (let x = 0; x < columns + 1; x++) {
    if (!crossPoints[x]) crossPoints.push([])
    for (let y = 0; y < rows + 1; y++) {
      crossPoints[x][y] = new Point({
        x,
        y,
        rows,
        columns,
        simplexX: simplex[Seeds.SwayX],
        simplexY: simplex[Seeds.SwayY],
        width,
        height,
      })
    }
  }

  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      c.beginPath()
      const topLeft = crossPoints[x][y]
      const topRight = crossPoints[x + 1][y]
      const bottomLeft = crossPoints[x][y + 1]
      const bottomRight = crossPoints[x + 1][y + 1]

      c.moveTo(topLeft.x, topLeft.y)

      // top
      if (y === 0) {
        c.lineTo(topRight.x, topRight.y)
      } else {
        addToCurves(
          c,
          topLeft,
          topRight,
          simplex[Seeds.FlipY].noise2D(x, y - 1) < 0,
          false
        )
      }

      // right
      if (x < columns - 1) {
        addToCurves(
          c,
          topRight,
          bottomRight,
          simplex[Seeds.FlipX].noise2D(x, y) < 0,
          false
        )
      } else {
        c.lineTo(bottomRight.x, bottomRight.y)
      }

      // bottom
      if (y < rows - 1) {
        addToCurves(
          c,
          bottomRight,
          bottomLeft,
          simplex[Seeds.FlipY].noise2D(x, y) >= 0,
          false
        )
      } else {
        c.lineTo(bottomLeft.x, bottomLeft.y)
      }

      // left
      if (x === 0) {
        c.lineTo(topLeft.x, topLeft.y)
      } else {
        addToCurves(
          c,
          bottomLeft,
          topLeft,
          simplex[Seeds.FlipX].noise2D(x - 1, y) >= 0,
          false
        )
      }

      c.closePath()
      c.stroke()
    }
  }
}
