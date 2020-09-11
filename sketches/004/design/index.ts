import shuffleSeed from 'shuffle-seed'

import { Design } from 'types'
import { randomFromNoise, map } from 'utils/numberUtils'

import Dot from './Dot'
import { BACKGROUND, COLORS } from './constants'

const DOT_ROWS = 8
const DOT_COLUMNS = 7
const DOT_COUNT = DOT_ROWS * DOT_COLUMNS
const DOT_DRAW_FRAMES = 70

export enum Seeds {
  Color,
  Size,
  Rotation,
}

export const design = ({ c, simplex, seed, width, height, bleed }: Design) => {
  c.fillStyle = BACKGROUND
  c.fillRect(0, 0, width, height)

  let shuffledColors = [] as string[]
  while (shuffledColors.length < DOT_COUNT) {
    shuffledColors.push(
      ...shuffleSeed.shuffle(COLORS, seed[Seeds.Color] + shuffledColors.length)
    )
  }

  const dots = []
  for (let i = 0; i < DOT_COUNT; i++) {
    dots.push(
      new Dot({
        x: map(i % DOT_COLUMNS, 0, DOT_COLUMNS - 1, -60, width + 60),
        y: map(Math.floor(i / DOT_COLUMNS), 0, DOT_ROWS - 1, 0, height + 80),
        color: shuffledColors[i],
        flip: !!(i % 2),
        sizeRandom: randomFromNoise(simplex[Seeds.Size].noise2D(1, i)),
        rotationRandom: randomFromNoise(simplex[Seeds.Rotation].noise2D(1, i)),
      })
    )
  }

  for (let t = 0; t < DOT_DRAW_FRAMES; t++) {
    dots.forEach((dot, i) => {
      dot.draw(c)
      dot.update()
    })
  }
}
