import SimplexNoise from 'simplex-noise'
import shuffleSeed from 'shuffle-seed'

import { Design } from 'types'
import { randomFromNoise, map } from 'utils/numberUtils'

import Dot from './Dot'
import { BACKGROUND, COLORS } from './constants'

const DOT_COUNT = 12
const DOT_DRAW_FRAMES = 200

export const design = ({ c, seed, width, height, bleed }: Design) => {
  c.fillStyle = BACKGROUND
  c.fillRect(0, 0, width, height)

  const simplex1 = new SimplexNoise(seed[1])
  const simplex2 = new SimplexNoise(seed[2])
  const simplex3 = new SimplexNoise(seed[3])

  let shuffledColors = [
    ...shuffleSeed.shuffle(COLORS, seed[0]),
    ...shuffleSeed.shuffle(COLORS, seed[0] + 1),
    ...shuffleSeed.shuffle(COLORS, seed[0] + 2),
  ]

  const dots = []
  for (let i = 0; i < DOT_COUNT; i++) {
    dots.push(
      new Dot({
        y: map(i, 0, DOT_COUNT - 1, height - bleed, bleed),
        color: shuffledColors[i],
        flip: !!(i % 2),
        sizeRandom: randomFromNoise(simplex1.noise2D(1, i)),
        rotationRandom: randomFromNoise(simplex2.noise2D(1, i)),
        curveRandom: randomFromNoise(simplex3.noise2D(1, i)),
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
