import SimplexNoise from 'simplex-noise'

import { Design } from 'types'
import { randomFromNoise } from 'utils/numberUtils'

import Dot from './Dot'
import { BACKGROUND } from './constants'

const DOT_COUNT = 30
const DOT_DRAW_FRAMES = 150

export const design = ({ c, seed, width, height }: Design) => {
  c.fillStyle = BACKGROUND
  c.fillRect(0, 0, width, height)

  const simplex0 = new SimplexNoise(seed[0])
  const simplex1 = new SimplexNoise(seed[1])
  const simplex2 = new SimplexNoise(seed[2])
  const simplex3 = new SimplexNoise(seed[3])
  const simplex4 = new SimplexNoise(seed[4])
  const simplex5 = new SimplexNoise(seed[5])

  for (let i = 0; i < DOT_COUNT; i++) {
    const x = (width * simplex0.noise2D(1, i)) / 2 + width / 2
    const y = (height * simplex0.noise2D(2, i)) / 2 + height / 2

    const colorRandom = randomFromNoise(simplex1.noise2D(1, i))
    const shadowRandom = randomFromNoise(simplex1.noise2D(2, i))
    const sizeRandom = randomFromNoise(simplex2.noise2D(1, i))
    const velocityRandom = randomFromNoise(simplex3.noise2D(1, i))
    const directionRandom = randomFromNoise(simplex4.noise2D(1, i))
    const rotationRandom = randomFromNoise(simplex5.noise2D(1, i))

    const dot = new Dot({
      x,
      y,
      colorRandom,
      shadowRandom,
      sizeRandom,
      velocityRandom,
      directionRandom,
      rotationRandom,
    })

    for (let t = 0; t < DOT_DRAW_FRAMES; t++) {
      dot.draw(c)
      dot.update(randomFromNoise(simplex3.noise2D(2.5 + t, i)))
    }
  }
}
