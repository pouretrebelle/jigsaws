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

  const triangleData: {
    color: string
    triangles: {
      name: keyof typeof TRIANGLES
      middle: [number, number]
    }[]
  }[] = []

  for (let i = 0; i < COLOR_COUNT; i++) {
    const h = Math.floor(
      randomFromNoise(simplex[Seeds.Color].noise2D(235.25 + i, 123.33)) * 360
    )
    triangleData.push({ color: hsl(h, 50, 50), triangles: [] })
  }

  const drawTriangle = (
    color: string,
    [x, y]: [number, number],
    corners: [[number, number], [number, number]]
  ) => {
    c.fillStyle = color
    c.strokeStyle = color
    c.beginPath()
    c.moveTo(x, y)
    corners.forEach(([cX, cY]) => c.lineTo(x + (cX * w) / 2, y + (cY * h) / 2))
    c.closePath()
    c.fill()
    c.stroke()
  }

  const w = width / GRID_ROWS
  const h = height / GRID_COLUMNS
  c.lineWidth = 0.1

  const getColorIndex = ([x, y]: [number, number]): number =>
    Math.floor(
      map(
        simplex[Seeds.Position].noise3D(
          (x / width) * GRID_COLUMNS * GRID_FIDELITY_HORIZONTAL,
          (y / height) * GRID_ROWS * GRID_FIDELITY_VERTICAL,
          noiseStart
        ),
        -0.9,
        0.9,
        0,
        COLOR_COUNT - 0.01,
        true
      )
    )

  for (let col = 0; col < GRID_COLUMNS; col++) {
    for (let row = 0; row < GRID_ROWS; row++) {
      const x = w * col
      const y = h * row
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

        triangleData[colorIndex].triangles.push({ name, middle })
      })
    }
  }

  triangleData.forEach(({ color, triangles }) => {
    triangles.forEach(({ name, middle }) =>
      drawTriangle(color, middle, TRIANGLES[name].corners)
    )
  })

  c.restore()
}
