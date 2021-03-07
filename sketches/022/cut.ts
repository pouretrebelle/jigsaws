import SimplexNoise from 'simplex-noise'
import { Cut } from 'types'
import Vector2 from 'utils/Vector2'

export enum Seeds {
  SwayX,
  SwayY,
  FlipX,
  FlipY,
}

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
  moveTo: boolean
) => {
  const tVmult = 0.2 // push of t towards other side of piece
  const tVdiv = 0.6 // push of p1c and p2c away from other side of piece
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

  if (moveTo) c.moveTo(p1.x, p1.y)
  c.bezierCurveTo(p1c.x, p1c.y, t1.x, t1.y, t.x, t.y)
  c.bezierCurveTo(t2.x, t2.y, p2c.x, p2c.y, p2.x, p2.y)
}

interface PointConnection {
  draw: (c: CanvasRenderingContext2D, moveTo: boolean) => void
}

interface Square {
  x: number
  y: number
  nw: PointConnection
  se: PointConnection
  sw: PointConnection
  ne: PointConnection
}

const createConnection = (start: Point, end: Point, condition1: boolean, condition2: boolean, fallback: boolean): PointConnection => ({
  draw: (c, moveTo) => {
    if (!condition1 || !condition2) {
      addToCurves(c, start, end, condition1 ? true : condition2 ? false : fallback, moveTo)
    }
  }
})

const createSquares = ({ width, columns, height, rows, simplex }: Cut) => {
  const cornerPoints = [] as Point[][]

  for (let x = 0; x < columns + 1; x++) {
    if (!cornerPoints[x]) cornerPoints.push([])
    for (let y = 0; y < rows + 1; y++) {
      cornerPoints[x][y] = new Point({
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

  const squares = [] as Square[][]
  for (let x = 0; x < columns; x++) {
    if (!squares[x]) squares.push([])
    for (let y = 0; y < rows; y++) {
      const topLeft = cornerPoints[x][y]
      const topRight = cornerPoints[x + 1][y]
      const bottomLeft = cornerPoints[x][y + 1]
      const bottomRight = cornerPoints[x + 1][y + 1]
      const middle = new Point({
        x: x + 0.5,
        y: y + 0.5,
        rows,
        columns,
        simplexX: simplex[Seeds.SwayX],
        simplexY: simplex[Seeds.SwayY],
        width,
        height,
      })

      squares[x][y] = {
        x,
        y,
        nw: createConnection(topLeft, middle, y === 0, x === 0, simplex[Seeds.FlipX].noise2D(x * 2, y * 2) < 0),
        se: createConnection(middle, bottomRight, x === columns - 1, y === rows - 1, simplex[Seeds.FlipX].noise2D(x * 2, y * 2) < 0),
        sw: createConnection(bottomLeft, middle, x === 0, y === rows - 1, simplex[Seeds.FlipY].noise2D(x * 2, y * 2) < 0),
        ne: createConnection(middle, topRight, y === 0, x === columns - 1, simplex[Seeds.FlipY].noise2D(x * 2, y * 2) < 0),
      }
    }
  }
  return squares
}

export const cut = (cutAttrs: Cut) => {
  const { c, width, columns, height, rows, simplex } = cutAttrs

  c.beginPath()
  c.moveTo(0, 0)
  c.lineTo(width, 0)
  c.lineTo(width, height)
  c.lineTo(0, height)
  c.lineTo(0, 0)
  c.stroke()

  const squares = createSquares(cutAttrs)

  // top left half of SW -> NE
  for (let y = 0; y <= columns; y++) {
    c.beginPath()
    for (let len = 0; len < y; len++) {
      const square = squares[len][y - len - 1]
      const moveTo = len === 0
      square.sw.draw(c, moveTo)
      square.ne.draw(c, moveTo)
    }
    c.stroke()
  }

  // bottom right half of SW -> NE
  for (let x = 0; x < columns; x++) {
    c.beginPath()
    for (let len = 0; len < x; len++) {
      const square = squares[rows - x + len][rows - len - 1]
      const moveTo = len === 0
      square.sw.draw(c, moveTo)
      square.ne.draw(c, moveTo)
    }
    c.stroke()
  }

  // bottom left half of NW -> SW
  for (let y = 0; y <= rows; y++) {
    c.beginPath()
    for (let len = 0; len < y; len++) {
      const square = squares[len][rows - y + len]
      const moveTo = len === 0
      square.nw.draw(c, moveTo)
      square.se.draw(c, moveTo)
    }
    c.stroke()
  }

  // top right half of NW -> SW
  for (let x = 0; x < rows; x++) {
    c.beginPath()
    for (let len = 0; len < x; len++) {
      const square = squares[columns - x + len][len]
      const moveTo = len === 0
      square.nw.draw(c, moveTo)
      square.se.draw(c, moveTo)
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
}
