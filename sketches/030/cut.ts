import SimplexNoise from 'simplex-noise'
import { Cut } from 'types'
import { map } from 'utils/numberUtils'
import Vector2 from 'utils/Vector2'

export enum Seeds {
  SwayX,
  SwayY,
  Flip,
}

const INSET = 5
const CORNER_LEAN = 0.7

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
  moveTo: boolean,
  tabPosition: number = 0.5,
) => {
  const tVmult = 0.2 // push of t towards other side of piece
  const tVdiv = 0.6 // push of p1c and p2c away from other side of piece
  const tWidth = 0.7 // how far t1 and t2 are from the canter
  const pWidth = 0.3 // how far p1x and p2c are from the center

  const tabCenteredWidth = 1 - 2 * Math.abs(0.5 - tabPosition)
  const tabWidthRatio = tabCenteredWidth / 1
  const halfTabWidthRatio = (0.5 + tabWidthRatio / 2)
  const tabPoint = new Vector2(
    map(tabPosition, 0, 1, p1.x, p2.x),
    map(tabPosition, 0, 1, p1.y, p2.y),
  )
  const pV = p2.minusNew(p1).multiplyEq(tabCenteredWidth) // vector between p1 and p2 of tab width
  const pVi = p2.minusNew(p1).multiplyEq(1 - tabCenteredWidth) // vector between p1 and p2 of non-tab width
  const tV = pV.multiplyNew(tVmult / halfTabWidthRatio).rotate(flip ? 90 : -90, true) // perpendicular to pV
  const t = tabPoint.plusNew(tV) // top point of divet

  const longSide = pV.multiplyNew(pWidth).plusEq(pVi.multiplyEq(0.3))
  const shortSide = pV.multiplyNew(pWidth)

  const p1c = tabPoint.plusNew(tabPosition > 0.5 ? longSide : shortSide).minusEq(tV.multiplyNew(tabPosition > 0.5 ? tVdiv / tabWidthRatio : tVdiv))
  const t1 = t.minusNew(pV.multiplyNew(tWidth / (2 * (tabPosition > 0.5 ? halfTabWidthRatio : 1))))
  const t2 = t.plusNew(pV.multiplyNew(tWidth / (2 * (tabPosition < 0.5 ? halfTabWidthRatio : 1))))
  const p2c = tabPoint.minusNew(tabPosition < 0.5 ? longSide : shortSide).minusEq(tV.multiplyNew((tabPosition < 0.5 ? tVdiv / tabWidthRatio : tVdiv)))

  if (moveTo) c.moveTo(p1.x, p1.y)
  c.bezierCurveTo(p1c.x, p1c.y, t1.x, t1.y, t.x, t.y)
  c.bezierCurveTo(t2.x, t2.y, p2c.x, p2c.y, p2.x, p2.y)
}

interface PointConnection {
  drawIn: (c: CanvasRenderingContext2D, moveTo: boolean, drawEdgeLines: boolean) => void
  drawOut: (c: CanvasRenderingContext2D, moveTo: boolean, drawEdgeLines: boolean) => void
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
  outer!: Point
  inner!: Point
  flip!: boolean
  isLeftEdge?: boolean
  isRightEdge?: boolean
  isTopEdge?: boolean
  isBottomEdge?: boolean
  isCorner: boolean

  constructor(props: Omit<PointConnection, 'drawIn' | 'drawOut' | 'isCorner'>) {
    Object.assign(this, props)

    let edgeCount = 0
    if (props.isTopEdge || props.isBottomEdge) edgeCount++
    if (props.isLeftEdge || props.isRightEdge) edgeCount++

    this.isCorner = edgeCount === 2
  }

  drawIn = (c: CanvasRenderingContext2D, moveTo: boolean, drawEdgeLines: boolean) => {
    let lineToOuter = false
    const cStart = moveTo ? c.moveTo.bind(c) : c.lineTo.bind(c)

    if (this.ordinal === Ordinal.sw && drawEdgeLines) {
      if (this.isLeftEdge && !this.isBottomEdge) {
        lineToOuter = true
        cStart(this.outer.x - INSET, this.outer.y)
      }
      if (!this.isLeftEdge && this.isBottomEdge) {
        lineToOuter = true
        cStart(this.outer.x, this.outer.y + INSET)
      }
    }

    if (this.ordinal === Ordinal.ne && drawEdgeLines) {
      if (this.isRightEdge && !this.isTopEdge) {
        lineToOuter = true
        cStart(this.outer.x + INSET, this.outer.y)
      }
      if (!this.isRightEdge && this.isTopEdge) {
        lineToOuter = true
        cStart(this.outer.x, this.outer.y - INSET)
      }
    }

    if (lineToOuter) {
      c.lineTo(this.outer.x, this.outer.y)
    }

    // piece edge
    addToCurves(c, this.outer, this.inner, this.flip, !lineToOuter && moveTo, this.isCorner ? CORNER_LEAN : 0.5)
  }

  drawOut = (c: CanvasRenderingContext2D, moveTo: boolean, drawEdgeLines: boolean) => {
    addToCurves(c, this.inner, this.outer, !this.flip, moveTo, this.isCorner ? (1 - CORNER_LEAN) : 0.5)

    if (this.ordinal === Ordinal.sw && drawEdgeLines) {
      if (this.isLeftEdge && !this.isBottomEdge) {
        c.lineTo(this.outer.x - INSET, this.outer.y)
      }
      if (!this.isLeftEdge && this.isBottomEdge) {
        c.lineTo(this.outer.x, this.outer.y + INSET)
      }
    }

    if (this.ordinal === Ordinal.ne && drawEdgeLines) {
      if (this.isRightEdge && !this.isTopEdge) {
        c.lineTo(this.outer.x + INSET, this.outer.y)
      }
      if (!this.isRightEdge && this.isTopEdge) {
        c.lineTo(this.outer.x, this.outer.y - INSET)
      }
    }
  }
}

const createSquares = ({ width, columns, height, rows, simplex }: Cut) => {
  const cornerPoints = [] as Point[][]

  const ordinalCorners = {
    [Ordinal.nw]: new Vector2(0, 0),
    [Ordinal.se]: new Vector2(width, height),
    [Ordinal.sw]: new Vector2(0, height),
    [Ordinal.ne]: new Vector2(width, 0),
  }

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

      // the inner of each point connection is the centre of each square
      // drawing methods are based on whether the direction is going towards or away from the centre
      const inner = new Point({
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

      const getFlip = (addX: number, addY: number): boolean => simplex[Seeds.Flip].noise2D(22 + 15 * (x * 2 + addX), 33 + 15 * (y * 2 + addY)) < 0

      squares[x][y] = {
        x,
        y,
        nw: new PointConnection({
          ordinal: Ordinal.nw,
          outer: (isTopEdge && isLeftEdge) ? ordinalCorners[Ordinal.nw] : topLeft,
          inner,
          flip: getFlip(0, 0),
          isLeftEdge,
          isTopEdge,
        }),
        se: new PointConnection({
          ordinal: Ordinal.se,
          outer: (isRightEdge && isBottomEdge) ? ordinalCorners[Ordinal.se] : bottomRight,
          inner,
          flip: getFlip(1, 1),
          isRightEdge,
          isBottomEdge,
        }),
        sw: new PointConnection({
          ordinal: Ordinal.sw,
          outer: (isLeftEdge && isBottomEdge) ? ordinalCorners[Ordinal.sw] : bottomLeft,
          inner,
          flip: getFlip(0, 1),
          isLeftEdge,
          isBottomEdge,
        }),
        ne: new PointConnection({
          ordinal: Ordinal.ne,
          outer: (isRightEdge && isTopEdge) ? ordinalCorners[Ordinal.ne] : topRight,
          inner,
          flip: getFlip(1, 0),
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
      square.sw.drawIn(c, len === 0, true)
      square.ne.drawOut(c, false, true)
    }
    c.stroke()
  }

  // bottom right half of SW -> NE
  for (let x = 0; x < columns; x++) {
    c.beginPath()
    for (let len = 0; len < x; len++) {
      const square = squares[rows - x + len][rows - len - 1]
      square.sw.drawIn(c, len === 0, true)
      square.ne.drawOut(c, false, true)
    }
    c.stroke()
  }

  // bottom left half of NW -> SW
  for (let y = 0; y <= rows; y++) {
    c.beginPath()
    for (let len = 0; len < y; len++) {
      const square = squares[len][rows - y + len]
      square.nw.drawIn(c, len === 0, true)
      square.se.drawOut(c, false, true)
    }
    c.stroke()
  }

  // top right half of NW -> SW
  for (let x = 0; x < rows; x++) {
    c.beginPath()
    for (let len = 0; len < x; len++) {
      const square = squares[columns - x + len][len]
      square.nw.drawIn(c, len === 0, true)
      square.se.drawOut(c, false, true)
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
      squares[x][y].ne.drawOut(c, true, false)
      squares[x + 1][y].nw.drawIn(c, false, false)
      squares[x + 1][y].sw.drawOut(c, false, false)
      squares[x][y].se.drawIn(c, false, false)
      c.stroke()
    }
  }

  // to the bottom
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns - 1; y++) {
      c.beginPath()
      squares[x][y].sw.drawIn(c, true, false)
      squares[x][y].se.drawOut(c, false, false)
      squares[x][y + 1].ne.drawIn(c, false, false)
      squares[x][y + 1].nw.drawOut(c, false, false)
      c.stroke()
    }
  }

  // vertical edges
  for (let y = 1; y < rows - 1; y++) {
    c.beginPath()
    const leftSquare = squares[0][y]
    leftSquare.sw.drawIn(c, true, true)
    leftSquare.nw.drawOut(c, false, false)
    c.lineTo(leftSquare.nw.outer.x - INSET, leftSquare.nw.outer.y)
    c.closePath()
    c.stroke()

    c.beginPath()
    const rightSquare = squares[columns - 1][y]
    rightSquare.ne.drawIn(c, true, true)
    rightSquare.se.drawOut(c, false, false)
    c.lineTo(rightSquare.se.outer.x + INSET, rightSquare.se.outer.y)
    c.closePath()
    c.stroke()
  }

  // horizontal edges
  for (let x = 1; x < columns - 1; x++) {
    c.beginPath()
    const topSquare = squares[x][0]
    topSquare.ne.drawIn(c, true, true)
    topSquare.nw.drawOut(c, false, false)
    c.lineTo(topSquare.nw.outer.x, topSquare.nw.outer.y - INSET)
    c.closePath()
    c.stroke()

    c.beginPath()
    const bottomSquare = squares[x][rows - 1]
    bottomSquare.sw.drawIn(c, true, true)
    bottomSquare.se.drawOut(c, false, false)
    c.lineTo(bottomSquare.se.outer.x, bottomSquare.se.outer.y + INSET)
    c.closePath()
    c.stroke()
  }

  // top left corner
  const topLeftSquare = squares[0][0]
  c.beginPath()
  topLeftSquare.sw.drawIn(c, true, true)
  topLeftSquare.nw.drawOut(c, false, false)
  c.closePath()
  c.stroke()
  c.beginPath()
  topLeftSquare.ne.drawIn(c, true, true)
  topLeftSquare.nw.drawOut(c, false, false)
  c.closePath()
  c.stroke()

  // top right corner
  const topRightSquare = squares[columns - 1][0]
  c.beginPath()
  topRightSquare.nw.drawIn(c, true, false)
  topRightSquare.ne.drawOut(c, false, false)
  c.lineTo(topRightSquare.nw.outer.x, topRightSquare.nw.outer.y - INSET)
  c.closePath()
  c.stroke()
  c.beginPath()
  topRightSquare.se.drawIn(c, true, false)
  topRightSquare.ne.drawOut(c, false, false)
  c.lineTo(topRightSquare.se.outer.x + INSET, topRightSquare.se.outer.y)
  c.closePath()
  c.stroke()

  // bottom right corner
  const bottomRightSquare = squares[columns - 1][rows - 1]
  c.beginPath()
  bottomRightSquare.ne.drawIn(c, true, true)
  bottomRightSquare.se.drawOut(c, false, false)
  c.closePath()
  c.stroke()
  c.beginPath()
  bottomRightSquare.sw.drawIn(c, true, true)
  bottomRightSquare.se.drawOut(c, false, false)
  c.closePath()
  c.stroke()

  // bottom left corner
  const bottomLeftSquare = squares[0][rows - 1]
  c.beginPath()
  bottomLeftSquare.nw.drawIn(c, true, false)
  bottomLeftSquare.sw.drawOut(c, false, false)
  c.lineTo(bottomLeftSquare.nw.outer.x - INSET, bottomLeftSquare.nw.outer.y)
  c.closePath()
  c.stroke()
  c.beginPath()
  bottomLeftSquare.se.drawIn(c, true, false)
  bottomLeftSquare.sw.drawOut(c, false, false)
  c.lineTo(bottomLeftSquare.se.outer.x, bottomLeftSquare.se.outer.y + INSET)
  c.closePath()
  c.stroke()
}

export const countPieces = ({ columns, rows }: Cut) => columns * rows * 2 + columns + rows
