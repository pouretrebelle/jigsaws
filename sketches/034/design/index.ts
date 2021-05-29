import { Design } from 'types'
import { hsl, hsla } from 'utils/colorUtils'
import { map, randomFromNoise } from 'utils/numberUtils'

import { COLOR_COUNT, GRID_COLUMNS, GRID_ROWS } from './constants'

export enum Seeds {
  Color
}

export const design = ({ c, simplex, width, height, noiseStart }: Design) => {
  const hues: number[] = []
  for (let i = 0; i < COLOR_COUNT; i++) {
    hues.push(Math.floor(randomFromNoise(simplex[Seeds.Color].noise2D(5.25 + i, 3.33)) * 360))
  }
  c.save()

  c.fillStyle = hsl(hues[0], 40, 20)
  c.fillRect(0, 0, width, height)

  const gridItemSize = width / GRID_ROWS
  for (let y = -gridItemSize; y < height; y += width / GRID_COLUMNS) {
    for (let x = -gridItemSize; x < width; x += width / GRID_ROWS) {
      c.fillStyle = hsla(hues[1], 40, 50, 0.2)

      const loops = Math.floor(map(simplex[Seeds.Color].noise2D(4.321 + x * 0.01, 5.432 + y * 0.01), -0.5, 1, 0, 10, true))

      c.save()

      c.translate(x + gridItemSize, y + gridItemSize)

      for (let i = 0; i < loops; i++) {
        c.globalCompositeOperation = i % 2 ? 'multiply' : 'screen'
        c.rotate(Math.PI / 4)
        c.scale(1 / Math.sqrt(2), 1 / Math.sqrt(2))
        c.fillRect(-gridItemSize / 2, -gridItemSize / 2, gridItemSize, gridItemSize)
        c.fillRect(gridItemSize / 2, gridItemSize / 2, gridItemSize, gridItemSize)
      }

      c.restore()
    }
  }

  c.restore()
}
