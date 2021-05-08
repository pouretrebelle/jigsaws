import SimplexNoise from 'simplex-noise'
import { Cut } from 'types'
import Vector2 from 'utils/Vector2'

export enum Seeds {
  SwayX,
  SwayY,
  FlipX,
  FlipY,
}

const INSET = 5

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
    this.x = INSET + tweakDist(x, y, columns, simplexX) * (width - INSET * 2)
    this.y = INSET + tweakDist(y, x, rows, simplexY) * (height - INSET * 2)
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
  drawReverse: (c: CanvasRenderingContext2D, moveTo: boolean) => void
}

enum Ordinal {
  nw,
  se,
  sw,
  ne
}

interface Square {
  x: number
  y: number
  nw: PointConnection
  se: PointConnection
  sw: PointConnection
  ne: PointConnection
}

class PointConnection {
  ordinal!: Ordinal
  start!: Point
  end!: Point
  flip!: boolean
  isLeftEdge?: boolean
  isRightEdge?: boolean
  isTopEdge?: boolean
  isBottomEdge?: boolean

  constructor(props: Omit<PointConnection, 'draw' | 'drawReverse'>) {
    Object.assign(this, props)
  }

  draw = (c: CanvasRenderingContext2D, moveTo: boolean) => {
    let neverMoveTo = false
    const cStart = moveTo ? c.moveTo.bind(c) : c.lineTo.bind(c)

    if (this.ordinal === Ordinal.sw && (this.isLeftEdge || this.isBottomEdge)) {
      neverMoveTo = true
      if (this.isLeftEdge && this.isBottomEdge) {
        cStart(this.start.x - INSET, this.start.y + INSET)
      }
      else if (this.isLeftEdge) {
        cStart(0, this.start.y)
      }
      else {
        cStart(this.start.x, this.start.y + INSET)
      }

      c.lineTo(this.start.x, this.start.y)
    }

    if (this.ordinal === Ordinal.nw && this.isLeftEdge && this.isTopEdge) {
      neverMoveTo = true
      cStart(this.start.x - INSET, this.start.y - INSET)
      c.lineTo(this.start.x, this.start.y)
    }

    // piece edge
    addToCurves(c, this.start, this.end, this.flip, !neverMoveTo && moveTo)

    if (this.ordinal === Ordinal.se && this.isRightEdge && this.isBottomEdge) {
      c.lineTo(this.end.x + INSET, this.end.y + INSET)
    }

    if (this.ordinal === Ordinal.ne && (this.isRightEdge || this.isTopEdge)) {
      if (this.isRightEdge && this.isTopEdge) {
        // top right corner
        c.lineTo(this.end.x + INSET, this.end.y - INSET)
      }
      else if (this.isRightEdge) {
        c.lineTo(this.end.x + INSET, this.end.y)
      }
      else {
        c.lineTo(this.end.x, this.end.y - INSET)
      }
    }
  }

  drawReverse = (c: CanvasRenderingContext2D, moveTo: boolean) => {
    addToCurves(c, this.end, this.start, !this.flip, moveTo)
  }
}

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

      const isLeftEdge = x === 0
      const isTopEdge = y === 0
      const isRightEdge = x === columns - 1
      const isBottomEdge = y === rows - 1

      squares[x][y] = {
        x,
        y,
        nw: new PointConnection({
          ordinal: Ordinal.nw,
          start: topLeft,
          end: middle,
          flip: simplex[Seeds.FlipX].noise2D(x * 2, y * 2) < 0,
          isLeftEdge,
          isTopEdge,
        }),
        se: new PointConnection({
          ordinal: Ordinal.se,
          start: middle,
          end: bottomRight,
          flip: simplex[Seeds.FlipX].noise2D(x * 2, y * 2) < 0,
          isRightEdge,
          isBottomEdge,
        }),
        sw: new PointConnection({
          ordinal: Ordinal.sw,
          start: bottomLeft,
          end: middle,
          flip: simplex[Seeds.FlipX].noise2D(x * 2, y * 2) < 0,
          isLeftEdge,
          isBottomEdge,
        }),
        ne: new PointConnection({
          ordinal: Ordinal.ne,
          start: middle,
          end: topRight,
          flip: simplex[Seeds.FlipX].noise2D(x * 2, y * 2) < 0,
          isRightEdge,
          isTopEdge,
        }),
      }
    }
  }
  return squares
}

export const cut = (cutAttrs: Cut) => {
  const { c, width, columns, height, rows } = cutAttrs

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
      square.sw.draw(c, len === 0)
      square.ne.draw(c, false)
    }
    c.stroke()
  }

  // bottom right half of SW -> NE
  for (let x = 0; x < columns; x++) {
    c.beginPath()
    for (let len = 0; len < x; len++) {
      const square = squares[rows - x + len][rows - len - 1]
      square.sw.draw(c, len === 0)
      square.ne.draw(c, false)
    }
    c.stroke()
  }

  // bottom left half of NW -> SW
  for (let y = 0; y <= rows; y++) {
    c.beginPath()
    for (let len = 0; len < y; len++) {
      const square = squares[len][rows - y + len]
      square.nw.draw(c, len === 0)
      square.se.draw(c, false)
    }
    c.stroke()
  }

  // top right half of NW -> SW
  for (let x = 0; x < rows; x++) {
    c.beginPath()
    for (let len = 0; len < x; len++) {
      const square = squares[columns - x + len][len]
      square.nw.draw(c, len === 0)
      square.se.draw(c, false)
    }
    c.stroke()
  }
}

export const cutPieces = (cutAttrs: Cut) => {
  const { c, columns, rows } = cutAttrs

  const squares = createSquares(cutAttrs)

  // on the right
  for (let x = 0; x < rows - 1; x++) {
    for (let y = 0; y < columns; y++) {
      c.beginPath()
      squares[x][y].ne.draw(c, true)
      squares[x + 1][y].nw.draw(c, false)
      squares[x + 1][y].sw.drawReverse(c, false)
      squares[x][y].se.drawReverse(c, false)
      c.stroke()
    }
  }

  // to the bottom
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns - 1; y++) {
      c.beginPath()
      squares[x][y].sw.draw(c, true)
      squares[x][y].se.draw(c, false)
      squares[x][y + 1].ne.drawReverse(c, false)
      squares[x][y + 1].nw.drawReverse(c, false)
      c.stroke()
    }
  }

  // vertical edges
  for (let y = 1; y < rows - 1; y++) {
    c.beginPath()
    const leftSquare = squares[0][y]
    leftSquare.nw.draw(c, true)
    leftSquare.sw.drawReverse(c, false)
    c.lineTo(leftSquare.nw.start.x, leftSquare.nw.start.y)
    c.stroke()

    c.beginPath()
    const rightSquare = squares[columns - 1][y]
    rightSquare.ne.drawReverse(c, true)
    rightSquare.se.draw(c, false)
    c.lineTo(rightSquare.ne.end.x, rightSquare.ne.end.y)
    c.stroke()
  }

  // horizontal edges
  for (let x = 1; x < columns - 1; x++) {
    c.beginPath()
    const topSquare = squares[x][0]
    topSquare.nw.draw(c, true)
    topSquare.ne.draw(c, false)
    c.lineTo(topSquare.nw.start.x, topSquare.nw.start.y)
    c.stroke()

    c.beginPath()
    const bottomSquare = squares[x][rows - 1]
    bottomSquare.sw.draw(c, true)
    bottomSquare.se.draw(c, false)
    c.lineTo(bottomSquare.sw.start.x, bottomSquare.sw.start.y)
    c.stroke()
  }

  // top left corner
  const topLeftSquare = squares[0][0]
  c.beginPath()
  c.moveTo(topLeftSquare.nw.start.x, topLeftSquare.nw.start.y)
  c.lineTo(topLeftSquare.ne.end.x, topLeftSquare.ne.end.y)
  topLeftSquare.ne.drawReverse(c, false)
  topLeftSquare.sw.drawReverse(c, false)
  c.lineTo(topLeftSquare.nw.start.x, topLeftSquare.nw.start.y)
  c.stroke()

  // top right corner
  const topRightSquare = squares[columns - 1][0]
  c.beginPath()
  c.moveTo(topRightSquare.ne.end.x, topRightSquare.ne.end.y)
  c.lineTo(topRightSquare.se.end.x, topRightSquare.se.end.y)
  topRightSquare.se.drawReverse(c, false)
  topRightSquare.nw.drawReverse(c, false)
  c.lineTo(topRightSquare.ne.end.x, topRightSquare.ne.end.y)
  c.stroke()

  // bottom right corner
  const bottomRightSquare = squares[columns - 1][rows - 1]
  c.beginPath()
  c.moveTo(bottomRightSquare.se.end.x, bottomRightSquare.se.end.y)
  c.lineTo(bottomRightSquare.sw.start.x, bottomRightSquare.sw.start.y)
  bottomRightSquare.sw.draw(c, false)
  bottomRightSquare.ne.draw(c, false)
  c.lineTo(bottomRightSquare.se.end.x, bottomRightSquare.se.end.y)
  c.stroke()

  // top right corner
  const bottomLeftSquare = squares[0][rows - 1]
  c.beginPath()
  c.moveTo(bottomLeftSquare.sw.start.x, bottomLeftSquare.sw.start.y)
  c.lineTo(bottomLeftSquare.se.end.x, bottomLeftSquare.se.end.y)
  bottomLeftSquare.se.drawReverse(c, false)
  bottomLeftSquare.nw.drawReverse(c, false)
  c.lineTo(bottomLeftSquare.sw.start.x, bottomLeftSquare.sw.start.y)
  c.stroke()
}

export const countPieces = ({ columns, rows }: Cut) => columns * rows * 2 + columns + rows - 4
