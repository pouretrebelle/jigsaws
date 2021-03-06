import SimplexNoise from 'simplex-noise'
import { Cut } from 'types'
import { map, randomFromNoise } from 'utils/numberUtils'
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

interface Hole {
  row: number
  column: number
  rowSpan: number
  columnSpan: number
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

const getCutData = ({
  width,
  columns,
  height,
  rows,
  simplex,
}: Cut): { crossPoints: Point[][]; holes: Hole[] } => {
  const crossPoints: Point[][] = []

  let holes: Hole[] = []
  let holeI = 0
  while (holes.length < HOLE_COUNT) {
    holeI++
    const rowSpan = Math.floor(
      map(
        randomFromNoise(simplex[Seeds.Holes].noise2D(123.45, holeI * 2)),
        0,
        1,
        1,
        5
      )
    )
    const columnSpan = Math.floor(
      map(
        randomFromNoise(simplex[Seeds.Holes].noise2D(holeI * 2, 123.45)),
        0,
        1,
        1,
        5
      )
    )
    const row =
      1 +
      Math.floor(
        randomFromNoise(simplex[Seeds.Holes].noise2D(holeI * 2, Math.PI)) *
          (rows - rowSpan - 1)
      )
    const column =
      1 +
      Math.floor(
        randomFromNoise(simplex[Seeds.Holes].noise2D(Math.PI, holeI * 2)) *
          (columns - columnSpan - 1)
      )
    if (
      !holes.some(
        (hole) =>
          // top left
          (row >= hole.row - 1 &&
            row <= hole.row + hole.rowSpan &&
            column >= hole.column - 1 &&
            column <= hole.column + hole.columnSpan) ||
          // top right
          (row + rowSpan >= hole.row - 1 &&
            row + rowSpan <= hole.row + hole.rowSpan &&
            column >= hole.column - 1 &&
            column <= hole.column + hole.columnSpan) ||
          // bottom left
          (row >= hole.row - 1 &&
            row <= hole.row + hole.rowSpan &&
            column + columnSpan >= hole.column - 1 &&
            column + columnSpan <= hole.column + hole.columnSpan) ||
          // bottom right
          (row + rowSpan >= hole.row - 1 &&
            row + rowSpan <= hole.row + hole.rowSpan &&
            column + columnSpan >= hole.column - 1 &&
            column + columnSpan <= hole.column + hole.columnSpan)
      ) &&
      rowSpan + columnSpan > 3
    ) {
      holes.push({ row, column, rowSpan, columnSpan })
    }
  }

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

  // Make the holes rectangular by averaging each edge's position
  holes.forEach(({ row, column, rowSpan, columnSpan }) => {
    const left =
      (crossPoints[column][row].x + crossPoints[column][row + rowSpan].x) / 2
    for (let y = row; y <= row + rowSpan; y++) {
      crossPoints[column][y].x = left
    }

    const right =
      (crossPoints[column + columnSpan][row].x +
        crossPoints[column + columnSpan][row + rowSpan].x) /
      2
    for (let y = row; y <= row + rowSpan; y++) {
      crossPoints[column + columnSpan][y].x = right
    }

    const top =
      (crossPoints[column][row].y + crossPoints[column + columnSpan][row].y) / 2
    for (let x = column; x <= column + columnSpan; x++) {
      crossPoints[x][row].y = top
    }

    const bottom =
      (crossPoints[column][row + rowSpan].y +
        crossPoints[column + columnSpan][row + rowSpan].y) /
      2
    for (let x = column; x <= column + columnSpan; x++) {
      crossPoints[x][row + rowSpan].y = bottom
    }
  })

  return { crossPoints, holes }
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

  const { crossPoints, holes } = getCutData(cutArgs)

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
          holes.some(
            ({ row, column, rowSpan, columnSpan }) =>
              (column - 1 === x || column - 1 + columnSpan === x) &&
              y >= row &&
              y < row + rowSpan
          )
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
          holes.some(
            ({ row, column, rowSpan, columnSpan }) =>
              (row - 1 === y || row - 1 + rowSpan === y) &&
              x >= column &&
              x < column + columnSpan
          )
        )
      }
    }
    c.stroke()
  }
}

export const cutPieces = (cutArgs: Cut) => {
  const { c, width, columns, height, rows, simplex } = cutArgs
  const { crossPoints } = getCutData(cutArgs)

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
