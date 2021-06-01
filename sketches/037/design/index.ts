import { Design } from 'types'
import { hsl, hsla } from 'utils/colorUtils'
import { map, randomFromNoise } from 'utils/numberUtils'

import { LAYERS, GRID_ROWS, GRID_COLUMNS, GRID_FIDELITY, FILL_OPACITY } from './constants'

export enum Seeds {
  Color,
  Position,
}

export const design = ({ c, simplex, width, height, bleed, noiseStart }: Design) => {
  const hues: number[] = []
  for (let i = 0; i < LAYERS + 1; i++) {
    hues.push(
      Math.floor(
        randomFromNoise(simplex[Seeds.Color].noise2D(235.25 + i, 123.33)) * 360
      )
    )
  }
  c.save()

  c.fillStyle = hsl(hues[0], 20, 50)
  c.fillRect(0, 0, width, height)

  const gridUnitWidth = (width - bleed * 2) / GRID_COLUMNS
  const gridUnitHeight = (height - bleed * 2) / GRID_ROWS
  for (let layerI = 0; layerI < LAYERS; layerI++) {
    c.save()

    for (let y = bleed - gridUnitHeight * (layerI + 2) / 2; y < height; y += gridUnitHeight) {
      for (let x = bleed - gridUnitWidth * (layerI + 2) / 2; x < width; x += gridUnitWidth) {
        c.fillStyle = hsla(hues[layerI + 1], 50, 50, FILL_OPACITY)

        const loops = Math.floor(
          map(
            simplex[Seeds.Position].noise3D(4.321 + x * GRID_FIDELITY + layerI * 10, 5.432 + y * GRID_FIDELITY + layerI * 10, noiseStart * 0.5),
            0.2,
            1,
            0,
            16,
            true
          )
        )

        c.save()

        c.translate(x + gridUnitWidth, y + gridUnitHeight)
        c.save()
        c.rotate(Math.PI / 4)

        const ROTATION = Math.PI / 16
        const SCALE = 0.85

        c.globalCompositeOperation = 'screen'

        for (let i = 0; i < loops; i++) {
          c.fillRect(
            -gridUnitWidth / 2,
            -gridUnitHeight / 2,
            gridUnitWidth,
            gridUnitHeight,
          )
          c.rotate(ROTATION)
          c.lineWidth *= 1 / SCALE
          c.scale(SCALE, SCALE)
        }

        c.restore()

        const altLoops = Math.floor(
          map(
            simplex[Seeds.Position].noise3D(104.321 + x * GRID_FIDELITY + layerI * 10, 105.432 + y * GRID_FIDELITY + layerI * 10, noiseStart * 0.5),
            0.2,
            1,
            0,
            16,
            true
          )
        )

        c.rotate(Math.PI / 4)
        c.translate(gridUnitWidth / 2, gridUnitHeight / 2)

        c.globalCompositeOperation = 'multiply'

        for (let i = 0; i < altLoops; i++) {
          c.fillRect(
            -gridUnitWidth / 2,
            -gridUnitHeight / 2,
            gridUnitWidth,
            gridUnitHeight,
          )
          c.rotate(-ROTATION)
          c.lineWidth *= 1 / SCALE
          c.scale(SCALE, SCALE)
        }


        c.restore()
      }
    }

    c.restore()
  }

  c.restore()
}
