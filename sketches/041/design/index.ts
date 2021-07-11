import { Design } from 'types'
import { map } from 'utils/numberUtils'
import {
  COLOR_COUNT,
  COLORS,
  GRID_COLUMNS,
  GRID_ROWS,
  TRIANGLES,
} from './constants'
import { getContrastingColorScale } from './colors'

export enum Seeds {
  Color,
  Position,
}

export const design = ({
  c,
  simplex,
  width,
  height,
  bleed,
  noiseStart,
}: Design) => {
  c.save()

  const triangles: {
    colorIndex: number
    name: keyof typeof TRIANGLES
    middle: [number, number]
  }[] = []

  const colors = getContrastingColorScale(
    COLORS,
    simplex[Seeds.Color],
    COLOR_COUNT
  )

  const drawTriangle = (
    fill: string,
    stroke: string,
    [x, y]: [number, number],
    corners: [[number, number], [number, number]]
  ) => {
    c.fillStyle = fill
    c.strokeStyle = stroke
    c.beginPath()
    c.moveTo(x, y)
    corners.forEach(([cX, cY]) => c.lineTo(x + (cX * w) / 2, y + (cY * h) / 2))
    c.closePath()
    c.fill()
    c.stroke()
  }

  const getColorIndex = ([x, y]: [number, number]): number =>
    Math.floor(
      map(
        simplex[Seeds.Position].noise3D(
          (x / width) * GRID_COLUMNS * 0.07,
          (y / height) * GRID_ROWS * 0.07,
          noiseStart
        ) *
          0.9 +
          simplex[Seeds.Position].noise2D(
            (x / width) * GRID_COLUMNS * 0.4,
            (y / height) * GRID_ROWS * 0.4
          ) *
            0.1,
        -0.8,
        0.8,
        0,
        COLOR_COUNT - 0.01,
        true
      )
    )

  const w = (width - bleed * 2) / GRID_COLUMNS
  const h = (height - bleed * 2) / GRID_ROWS
  const colOverhang = Math.ceil(bleed % w) + 1.5
  const rowOverhang = Math.ceil(bleed % h) + 1.5
  c.lineWidth = 0.3

  for (let col = -colOverhang; col < GRID_COLUMNS + colOverhang; col++) {
    for (let row = -rowOverhang; row < GRID_ROWS + rowOverhang; row++) {
      const x = bleed + w * col
      const y = bleed + h * row
      const middle: [number, number] = [x + w / 2, y + h / 2]

      const getPos = ([uX, uY]: [number, number]): [number, number] => [
        (col + 0.5 + uX / 2) * w,
        (row + 0.5 + uY / 2) * h,
      ]

      Object.entries(TRIANGLES).map(([name, { sampleDir, comparisonDirs }]) => {
        const compareA = getColorIndex(getPos(comparisonDirs[0]))
        const compareB = getColorIndex(getPos(comparisonDirs[1]))
        const colorIndex =
          compareA === compareB ? compareA : getColorIndex(getPos(sampleDir))

        triangles.push({ name, middle, colorIndex })
      })
    }
  }

  triangles
    .sort((a, b) => b.colorIndex - a.colorIndex)
    .forEach(({ colorIndex, name, middle }) =>
      drawTriangle(
        colors[colorIndex],
        colors[(colorIndex + 1) % colors.length],
        middle,
        TRIANGLES[name].corners
      )
    )

  c.restore()
}
