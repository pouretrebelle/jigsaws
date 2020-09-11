import { Design } from 'types'
import { randomFromNoise } from 'utils/numberUtils'

import Dot from './Dot'
import { BACKGROUND } from './constants'

const DOT_COUNT = 30
const DOT_DRAW_FRAMES = 150

export enum Seeds {
  Color,
  Size,
  Direction,
  Rotation,
  Curve,
}

export const design = ({ c, simplex, width, height, noiseStart }: Design) => {
  c.fillStyle = BACKGROUND
  c.fillRect(0, 0, width, height)
  c.save()
  c.translate(width / 2, height / 2)

  const dots = []

  for (let i = 0; i < DOT_COUNT; i++) {
    dots.push(
      new Dot({
        colorRandom: randomFromNoise(simplex[Seeds.Color].noise2D(1, i)),
        shadowRandom: randomFromNoise(simplex[Seeds.Color].noise2D(2, i)),
        sizeRandom: randomFromNoise(simplex[Seeds.Size].noise2D(0, i)),
        directionRandom: randomFromNoise(
          simplex[Seeds.Direction].noise2D(0, i)
        ),
        rotationRandom: randomFromNoise(
          simplex[Seeds.Rotation].noise2D(noiseStart, i)
        ),
        curveRandom: randomFromNoise(simplex[Seeds.Curve].noise2D(0, i)),
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
