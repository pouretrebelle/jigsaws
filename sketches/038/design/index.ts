import SimplexNoise from 'simplex-noise'
import { Design } from 'types'
import { arrayValueFromRandom, indexOfUniqueValue } from 'utils/arrayUtils'
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

  const getColorIndex = (col: number, row: number): number =>
    Math.floor(
      ((simplex[Seeds.Position].noise2D(
        col * GRID_FIDELITY_HORIZONTAL,
        row * GRID_FIDELITY_VERTICAL
      ) +
        1) /
        2) *
        colors.length
    )

  const getColorIndexSquare = (col: number, row: number): number[] => {
    return [
      getColorIndex(col, row),
      getColorIndex(col + 1, row),
      getColorIndex(col + 1, row + 1),
      getColorIndex(col, row + 1),
    ]
  }

  const w = width / GRID_ROWS
  const h = height / GRID_COLUMNS
  const buffer = 0.1
  for (let col = 0; col < GRID_COLUMNS; col++) {
    for (let row = 0; row < GRID_ROWS; row++) {
      let x = w * col
      let y = h * row

      const colorIndexes = getColorIndexSquare(col, row)
      const uniqueColorIndexes = [...new Set(colorIndexes)]
      const [nw, ne, se, sw] = colorIndexes

      const tl = { x: x - buffer, y: y - buffer }
      const tr = { x: x + w + buffer, y: y - buffer }
      const br = { x: x + w + buffer, y: y + h + buffer }
      const bl = { x: x - buffer, y: y + h + buffer }

      const drawTriangle = (...corners: { x: number; y: number }[]) => {
        c.beginPath()
        corners.forEach(({ x, y }, i) => c[i === 0 ? 'moveTo' : 'lineTo'](x, y))
        c.fill()
      }

      if (
        (nw === ne && sw === se) ||
        (nw === sw && ne === se) ||
        uniqueColorIndexes.length !== 2
      ) {
        c.fillStyle = colors[Math.max(...uniqueColorIndexes)]
        c.fillRect(tl.x, tl.y, w + buffer * 2, h + buffer * 2)
      } else if (nw !== se) {
        c.fillStyle = colors[se]
        drawTriangle(tr, br, bl)

        c.fillStyle = colors[nw]
        drawTriangle(tl, tr, bl)
      } else if (ne !== sw) {
        c.fillStyle = colors[sw]
        drawTriangle(tl, br, bl)

        c.fillStyle = colors[ne]
        drawTriangle(tl, tr, br)
      }
    }
  }

  c.restore()
}
