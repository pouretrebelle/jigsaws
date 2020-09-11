import shuffleSeed from 'shuffle-seed'

import { Design } from 'types'
import { randomFromNoise, map } from 'utils/numberUtils'

import Dot from './Dot'
import { BACKGROUND, COLORS } from './constants'

const DOT_COUNT = 12
const DOT_DRAW_FRAMES = 200

export enum Seeds {
  Color,
  Size,
  Rotation,
  Curve,
}

export const design = ({ c, simplex, seed, width, height, bleed }: Design) => {
  c.fillStyle = BACKGROUND
  c.fillRect(0, 0, width, height)

  let shuffledColors = [
    ...shuffleSeed.shuffle(COLORS, seed[Seeds.Color]),
    ...shuffleSeed.shuffle(COLORS, seed[Seeds.Color] + 1),
    ...shuffleSeed.shuffle(COLORS, seed[Seeds.Color] + 2),
  ]

  const dots = []
  for (let i = 0; i < DOT_COUNT; i++) {
    dots.push(
      new Dot({
        y: map(i, 0, DOT_COUNT - 1, height - bleed, bleed),
        color: shuffledColors[i],
        flip: !!(i % 2),
        sizeRandom: randomFromNoise(simplex[Seeds.Size].noise2D(1, i)),
        rotationRandom: randomFromNoise(simplex[Seeds.Rotation].noise2D(1, i)),
        curveRandom: randomFromNoise(simplex[Seeds.Curve].noise2D(1, i)),
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
