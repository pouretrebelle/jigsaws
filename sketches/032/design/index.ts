import { Design } from 'types'
import { hsl } from 'utils/colorUtils'
import { randomFromNoise } from 'utils/numberUtils'

import {
  GRID_COLUMNS,
  GRID_ROWS,
  GRID_GAP_RATIO,
  LAYERS,
  COLORS,
} from './constants'

export enum Seeds {
  Shape,
  Color,
}

class Point {
  x!: number
  y!: number
  visible!: boolean

  constructor(props: { x: number; y: number; visible: boolean }) {
    Object.assign(this, props)
  }
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
  for (let i = 0; i < COLORS; i++) {
    hues.push(
      Math.floor(
        randomFromNoise(simplex[Seeds.Color].noise2D(5.25 + i, 3.33)) * 360
      )
    )
  }
  c.save()

  c.fillStyle = hsl(hues[0], 50, 50)
  c.fillRect(0, 0, width, height)

  const cellWidth = (width - bleed * 2) / (GRID_COLUMNS - 1 + GRID_GAP_RATIO)
  const cellHeight = (height - bleed * 2) / (GRID_ROWS - 1 + GRID_GAP_RATIO)
  const gridGap = cellWidth * GRID_GAP_RATIO
  const gridBleed = bleed + gridGap / 2

  const drawLines = (
    gridOffset: number,
    gridMultiplier: number,
    lineWidth: number,
    noiseOffset: number
  ) => {
    c.lineWidth = lineWidth

    for (let layer = 0; layer < LAYERS; layer++) {
      // shift back half a unit every layer
      if (layer > 0) gridOffset -= 0.5 * gridMultiplier

      const crossPoints = [] as Point[][]
      for (
        let col = 0;
        col < (GRID_COLUMNS - gridOffset * 2) / gridMultiplier;
        col++
      ) {
        if (!crossPoints[col]) crossPoints.push([])
        for (
          let row = 0;
          row < (GRID_ROWS - gridOffset * 2) / gridMultiplier;
          row++
        ) {
          const x =
            col * cellWidth * gridMultiplier +
            gridBleed +
            cellWidth * gridOffset
          const y =
            row * cellHeight * gridMultiplier +
            gridBleed +
            cellHeight * gridOffset
          crossPoints[col][row] = new Point({
            x,
            y,
            visible:
              simplex[Seeds.Shape].noise3D(
                50 * layer + noiseOffset + noiseStart * gridMultiplier,
                x * 0.002,
                y * 0.01
              ) > 0.3,
          })
        }
      }

      for (
        let col = 0;
        col < (GRID_COLUMNS - gridOffset * 2) / gridMultiplier;
        col++
      ) {
        for (
          let row = 0;
          row < (GRID_ROWS - gridOffset * 2) / gridMultiplier;
          row++
        ) {
          const point = crossPoints[col][row]
          if (point.visible) {
            let length = 1
            while (
              crossPoints[col][row + length] &&
              crossPoints[col][row + length].visible
            ) {
              length++
            }

            if (length > 0) {
              c.strokeStyle = hsl(hues[layer % COLORS], 70, 50)
              c.beginPath()
              c.moveTo(
                point.x + (cellWidth / 2) * gridMultiplier,
                point.y + (cellHeight / 2) * gridMultiplier
              )
              c.lineTo(
                point.x + (cellWidth / 2) * gridMultiplier,
                point.y + (length - 0.5) * cellHeight * gridMultiplier
              )
              c.stroke()
            }
          }
        }
      }
    }
  }

  c.lineCap = 'round'
  c.globalCompositeOperation = 'multiply'
  c.globalAlpha = 0.2
  drawLines(-2, 4, cellWidth * 4 - gridGap, 12)
  c.globalAlpha = 0.3
  drawLines(-1, 3, cellWidth * 3 - gridGap, 123)
  c.globalAlpha = 0.4
  drawLines(-0.5, 2, cellWidth * 2 - gridGap, 234)
  c.globalCompositeOperation = 'screen'
  c.globalAlpha = 0.2
  drawLines(0, 1, cellWidth - gridGap, 345)

  c.restore()
}
