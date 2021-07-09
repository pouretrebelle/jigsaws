import { Design } from 'types'
import { hsl } from 'utils/colorUtils'
import { randomFromNoise } from 'utils/numberUtils'
import {
  COLOR_COUNT,
  GRID_COLUMNS,
  GRID_FIDELITY_HORIZONTAL,
  GRID_FIDELITY_VERTICAL,
  GRID_ROWS,
  TRIANGLES,
} from './constants'

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

  const hues: number[] = []
  for (let i = 0; i < COLOR_COUNT; i++) {
    hues.push(
      Math.floor(
        randomFromNoise(simplex[Seeds.Color].noise2D(235.25 + i, 123.33)) * 360
      )
    )
  }
  const colors = hues.map((h) => hsl(h, 50, 50))

  const drawTriangle = (
    colorIndex: number,
    m: { x: number; y: number },
    corners: [[number, number], [number, number]]
  ) => {
    c.fillStyle = colors[colorIndex]
    c.strokeStyle = colors[colorIndex]
    c.beginPath()
    c.moveTo(m.x, m.y)
    corners.forEach(([cX, cY]) =>
      c.lineTo(m.x + (cX * w) / 2, m.y + (cY * h) / 2)
    )
    c.closePath()
    c.fill()
    c.stroke()
  }

  const w = width / GRID_ROWS
  const h = height / GRID_COLUMNS
  c.lineWidth = 0.1

  const getColorIndex = ([x, y]: [number, number]): number =>
    Math.floor(
      ((simplex[Seeds.Position].noise2D(
        (x / width) * GRID_COLUMNS * GRID_FIDELITY_HORIZONTAL,
        (y / height) * GRID_ROWS * GRID_FIDELITY_VERTICAL
      ) +
        1) /
        2) *
        colors.length
    )

  for (let col = 0; col < GRID_COLUMNS; col++) {
    for (let row = 0; row < GRID_ROWS; row++) {
      let x = w * col
      let y = h * row

      const m = { x: x + w / 2, y: y + h / 2 }

      const getPos = ([uX, uY]: [number, number]): [number, number] => [
        (col + 0.5 + uX / 2) * w,
        (row + 0.5 + uY / 2) * h,
      ]

      Object.values(TRIANGLES).map(({ corners, sampleDir, comparisonDirs }) => {
        const compareA = getColorIndex(getPos(comparisonDirs[0]))
        const compareB = getColorIndex(getPos(comparisonDirs[1]))
        const colorIndex =
          compareA === compareB ? compareA : getColorIndex(getPos(sampleDir))
        drawTriangle(colorIndex, m, corners)
      })
    }
  }

  c.restore()
}
