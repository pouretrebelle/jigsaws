import { Design } from 'types'
import { arrayValueFromRandom } from 'utils/arrayUtils'
import { hsl } from 'utils/colorUtils'
import { randomFromNoise } from 'utils/numberUtils'
import {
  COLOR_COUNT,
  GRID_COLUMNS,
  GRID_FIDELITY_HORIZONTAL,
  GRID_FIDELITY_VERTICAL,
  GRID_ROWS,
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

  c.fillStyle = 'blue'
  c.fillRect(0, 0, width, height)

  const hues: number[] = []
  for (let i = 0; i < COLOR_COUNT; i++) {
    hues.push(
      Math.floor(
        randomFromNoise(simplex[Seeds.Color].noise2D(235.25 + i, 123.33)) * 360
      )
    )
  }
  const colors = hues.map((h) => hsl(h, 50, 50))

  const w = width / GRID_ROWS
  const h = height / GRID_COLUMNS
  const buffer = 0.1
  for (let col = 0; col < GRID_COLUMNS; col++) {
    for (let row = 0; row < GRID_ROWS; row++) {
      let x = w * col
      let y = h * row

      const positionValue = simplex[Seeds.Position].noise2D(
        col * GRID_FIDELITY_HORIZONTAL,
        row * GRID_FIDELITY_VERTICAL
      )

      c.fillStyle = arrayValueFromRandom(colors, (positionValue + 1) / 2)

      c.fillRect(x - buffer, y - buffer, w + buffer * 2, h + buffer * 2)
    }
  }

  c.restore()
}
