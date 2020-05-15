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
  c.save()
  c.translate(width / 2, height / 2)

  const simplex0 = new SimplexNoise(seed[0])
  const simplex1 = new SimplexNoise(seed[1])
  const simplex2 = new SimplexNoise(seed[2])
  const simplex3 = new SimplexNoise(seed[3])
  const simplex4 = new SimplexNoise(seed[4])

  const dots = []

  for (let i = 0; i < DOT_COUNT; i++) {
    dots.push(
      new Dot({
        colorRandom: randomFromNoise(simplex0.noise2D(1, i)),
        shadowRandom: randomFromNoise(simplex0.noise2D(2, i)),
        sizeRandom: randomFromNoise(simplex1.noise2D(1, i)),
        directionRandom: randomFromNoise(simplex2.noise2D(1, i)),
        rotationRandom: randomFromNoise(simplex3.noise2D(1, i)),
        curveRandom: randomFromNoise(simplex4.noise2D(1, i)),
      })
    )
  }

  for (let t = 0; t < DOT_DRAW_FRAMES; t++) {
    dots.forEach((dot, i) => {
      dot.draw(c)
      dot.update()
    })
  }

  c.restore()
}
