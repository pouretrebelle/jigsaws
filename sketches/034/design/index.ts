import { Design } from 'types'
import { hsl, hsla } from 'utils/colorUtils'
import { map, randomFromNoise } from 'utils/numberUtils'

import {
  LAYERS,
  GRID_ROWS,
  GRID_COLUMNS,
  LINE_WIDTH,
  GRID_FIDELITY,
  FILL_OPACITY,
  STROKE_OPACITY,
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

  c.fillStyle = hsl(hues[0], 40, 30)
  c.fillRect(0, 0, width, height)

  const gridUnitWidth = (width - bleed * 2) / GRID_COLUMNS
  const gridUnitHeight = (height - bleed * 2) / GRID_ROWS
  for (let layerI = 0; layerI < LAYERS; layerI++) {
    c.save()

    for (let y = bleed - gridUnitHeight; y < height; y += gridUnitHeight) {
      for (let x = bleed - gridUnitWidth; x < width; x += gridUnitWidth) {
        c.fillStyle = hsla(hues[layerI + 1], 50, 50, FILL_OPACITY)
        c.strokeStyle = hsla(hues[layerI + 1], 50, 50, STROKE_OPACITY)

        const loops = Math.floor(
          map(
            simplex[Seeds.Position].noise3D(
              4.321 + x * GRID_FIDELITY + layerI * 10,
              5.432 + y * GRID_FIDELITY + layerI * 10,
              noiseStart * 0.5
            ),
            0,
            1,
            0,
            8,
            true
          )
        )

        c.save()

        c.translate(x + gridUnitWidth, y + gridUnitHeight)
        c.save()
        c.lineWidth = LINE_WIDTH

        for (let i = 0; i < loops; i++) {
          c.globalCompositeOperation = i % 2 ? 'multiply' : 'screen'
          c.rotate(Math.PI / 4)

          c.lineWidth *= Math.sqrt(2)

          c.scale(1 / Math.sqrt(2), 1 / Math.sqrt(2))
          c.strokeRect(
            -gridUnitWidth / 2 + c.lineWidth / 2,
            -gridUnitHeight / 2 + c.lineWidth / 2,
            gridUnitWidth - c.lineWidth,
            gridUnitHeight - c.lineWidth
          )
          c.fillRect(
            -gridUnitWidth / 2 + c.lineWidth,
            -gridUnitHeight / 2 + c.lineWidth,
            gridUnitWidth - c.lineWidth * 2,
            gridUnitHeight - c.lineWidth * 2
          )
        }

        c.restore()

        const altLoops = Math.floor(
          map(
            simplex[Seeds.Position].noise3D(
              104.321 + x * GRID_FIDELITY + layerI * 10,
              105.432 + y * GRID_FIDELITY + layerI * 10,
              noiseStart * 0.5
            ),
            0,
            1,
            0,
            8,
            true
          )
        )

        c.translate(gridUnitWidth / 2, gridUnitHeight / 2)
        c.rotate(Math.PI / 4)
        c.lineWidth = LINE_WIDTH
        c.scale(1 / Math.sqrt(2), 1 / Math.sqrt(2))
        c.lineWidth *= Math.sqrt(2)

        for (let i = 0; i < altLoops - 1; i++) {
          c.lineWidth *= Math.sqrt(2)
          c.globalCompositeOperation = i % 2 ? 'multiply' : 'screen'
          c.rotate(Math.PI / 4)
          c.scale(1 / Math.sqrt(2), 1 / Math.sqrt(2))
          c.strokeRect(
            -gridUnitWidth / 2 + c.lineWidth / 2,
            -gridUnitHeight / 2 + c.lineWidth / 2,
            gridUnitWidth - c.lineWidth,
            gridUnitHeight - c.lineWidth
          )
          c.fillRect(
            -gridUnitWidth / 2 + c.lineWidth,
            -gridUnitHeight / 2 + c.lineWidth,
            gridUnitWidth - c.lineWidth * 2,
            gridUnitHeight - c.lineWidth * 2
          )
        }

        c.restore()
      }
    }

    c.restore()
  }

  c.restore()
}
