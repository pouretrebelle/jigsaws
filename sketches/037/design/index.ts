import { Design } from 'types'
import { hsl, hsla } from 'utils/colorUtils'
import { map, randomFromNoise } from 'utils/numberUtils'

import {
  LAYERS,
  GRID_ROWS,
  GRID_COLUMNS,
  GRID_FIDELITY,
  STROKE_OPACITY,
  LINE_WIDTH,
  INTERNAL_BLEED,
  ROSETTE_ROTATION,
  ROSETTE_SCALE,
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
  const hues: number[] = []
  for (let i = 0; i < LAYERS + 1; i++) {
    hues.push(
      Math.floor(
        randomFromNoise(simplex[Seeds.Color].noise2D(235.25 + i, 123.33)) * 360
      )
    )
  }
  c.save()

  c.fillStyle = hsl(hues[0], 40, 50)
  c.fillRect(0, 0, width, height)
  c.lineWidth = LINE_WIDTH

  const gridUnitWidth = (width - bleed * 2 - INTERNAL_BLEED * 2) / GRID_COLUMNS
  const gridUnitHeight = (height - bleed * 2 - INTERNAL_BLEED * 2) / GRID_ROWS
  for (let layerI = 0; layerI < LAYERS; layerI++) {
    c.save()

    for (
      let y = bleed + INTERNAL_BLEED - (gridUnitHeight * (layerI + 2)) / 2;
      y < height;
      y += gridUnitHeight
    ) {
      for (
        let x = bleed + INTERNAL_BLEED - (gridUnitWidth * (layerI + 2)) / 2;
        x < width;
        x += gridUnitWidth
      ) {
        c.strokeStyle = hsla(hues[layerI + 1], 50, 50, STROKE_OPACITY)

        const loops = Math.floor(
          map(
            simplex[Seeds.Position].noise3D(
              4.321 + x * GRID_FIDELITY + layerI * 10,
              5.432 + y * GRID_FIDELITY + layerI * 10,
              noiseStart * 0.5
            ),
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

        c.globalCompositeOperation = 'screen'

        for (let i = 0; i < loops; i++) {
          c.strokeRect(
            -gridUnitWidth / 2,
            -gridUnitHeight / 2,
            gridUnitWidth,
            gridUnitHeight
          )
          c.rotate(ROSETTE_ROTATION)
          c.scale(ROSETTE_SCALE, ROSETTE_SCALE)
        }

        c.restore()

        const altLoops = Math.floor(
          map(
            simplex[Seeds.Position].noise3D(
              104.321 + x * GRID_FIDELITY + layerI * 10,
              105.432 + y * GRID_FIDELITY + layerI * 10,
              noiseStart * 0.5
            ),
            0.2,
            1,
            0,
            16,
            true
          )
        )

        c.translate(gridUnitWidth / 2, gridUnitHeight / 2)

        c.globalCompositeOperation = 'multiply'

        for (let i = 0; i < altLoops; i++) {
          c.strokeRect(
            -gridUnitWidth / 2,
            -gridUnitHeight / 2,
            gridUnitWidth,
            gridUnitHeight
          )
          c.rotate(-ROSETTE_ROTATION)
          c.scale(ROSETTE_SCALE, ROSETTE_SCALE)
        }

        c.restore()
      }
    }

    c.restore()
  }

  c.restore()
}
