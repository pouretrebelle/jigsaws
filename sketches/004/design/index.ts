import { Design } from 'types'
import { arrayValueFromRandom, arrayValuesFromSimplex } from 'utils/arrayUtils'
import { map, randomFromNoise } from 'utils/numberUtils'

import Dot from './Dot'
import { BACKGROUND_COLORS, FOREGROUND_COLORS } from './constants'

const COLOR_COUNT = 5
const DOT_COUNT = 25
const DOT_DRAW_FRAMES = 250

export enum Seeds {
  Color,
  Position,
  Size,
  Curve,
  Flip,
}

export const design = ({ c, simplex, width, height, noiseStart }: Design) => {
  const background = arrayValueFromRandom(
    BACKGROUND_COLORS,
    randomFromNoise(simplex[Seeds.Color].noise2D(1, 1000))
  )
  const dotColors = arrayValuesFromSimplex(
    FOREGROUND_COLORS,
    simplex[Seeds.Color],
    COLOR_COUNT
  )

  c.fillStyle = background
  c.fillRect(0, 0, width, height)

  const dots = []
  for (let i = 0; i < DOT_COUNT; i++) {
    dots.push(
      new Dot({
        i,
        x: map(
          simplex[Seeds.Position].noise3D(1, i, noiseStart * 0.2),
          -1,
          1,
          0,
          width
        ),
        y: map(
          simplex[Seeds.Position].noise3D(i, 1, noiseStart * 0.2),
          -1,
          1,
          0,
          height
        ),
        color: dotColors[i % dotColors.length],
        shadow: background,
        sizeRandom: simplex[Seeds.Size].noise2D(i, noiseStart),
        curveRandom: simplex[Seeds.Curve].noise2D(1 + i, noiseStart * 1),
        startAngleRandom: simplex[Seeds.Curve].noise2D(0, i),
        changeDirFunc: (frame: number) =>
          simplex[Seeds.Flip].noise2D(i, frame * 0.1),
      })
    )
  }

  for (let t = 0; t < DOT_DRAW_FRAMES; t++) {
    dots.forEach((dot, i) => {
      if (dot.shouldDraw(width, height)) {
        dot.draw(c)
        dot.update()
      }
    })
  }
}
