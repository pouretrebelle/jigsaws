import { Raster } from 'types'
import { randomFromNoise } from 'utils/numberUtils'

import Dot from './Dot'
import { BACKGROUND } from './constants'

const DOT_COUNT = 30
const DOT_DRAW_FRAMES = 150

export enum Seeds {
  Position,
  Color,
  Size,
  Velocity,
  Direction,
  Rotation,
}

export const raster = ({ c, simplex, width, height, noiseStart }: Raster) => {
  c.fillStyle = BACKGROUND
  c.fillRect(0, 0, width, height)

  for (let i = 0; i < DOT_COUNT; i++) {
    const x =
      (width * simplex[Seeds.Position].noise2D(1 + noiseStart, i)) / 2 +
      width / 2
    const y =
      (height * simplex[Seeds.Position].noise2D(2 + noiseStart, i)) / 2 +
      height / 2

    const colorRandom = randomFromNoise(simplex[Seeds.Color].noise2D(1, i))
    const shadowRandom = randomFromNoise(simplex[Seeds.Color].noise2D(2, i))
    const sizeRandom = randomFromNoise(simplex[Seeds.Size].noise2D(1, i))
    const velocityRandom = simplex[Seeds.Velocity].noise2D(noiseStart * 0.01, i)
    const directionRandom = randomFromNoise(
      simplex[Seeds.Direction].noise2D(1 + noiseStart * 0.0005, i)
    )
    const rotationRandom = simplex[Seeds.Rotation].noise2D(
      1 + noiseStart * 0.1,
      i
    )

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
      dot.update(randomFromNoise(simplex[Seeds.Velocity].noise2D(2.5 + t, i)))
    }
  }
}
