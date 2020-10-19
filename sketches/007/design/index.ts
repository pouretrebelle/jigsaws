import { Design } from 'types'
import { map, randomFromNoise } from 'utils/numberUtils'
import { hsl } from 'utils/colorUtils'

import Dot from './Dot'
import { PRETTY_HUES } from './constants'
import { arrayValueFromRandom, arrayValuesFromSimplex } from 'utils/arrayUtils'

const COLOR_COUNT = 8
const DOT_COUNT = 40
const DOT_DRAW_FRAMES = 250

export enum Seeds {
  Color,
  Position,
  Size,
  Curve,
  Flip,
}

const getColorFromHue = (hue: number): string => {
  let sat = 100
  let bri = 70
  if (hue < 200 && hue > 40) {
    sat = 80
    bri = 60
  }
  return hsl(hue, sat, bri)
}

export const design = ({ c, simplex, width, height, noiseStart }: Design) => {
  const backgroundHue = arrayValueFromRandom(
    PRETTY_HUES,
    randomFromNoise(simplex[Seeds.Color].noise2D(1, 1))
  )
  const background = getColorFromHue(backgroundHue)
  const dotColors = arrayValuesFromSimplex(
    PRETTY_HUES.filter((hue) => Math.abs(hue - backgroundHue) > 15).map(
      getColorFromHue
    ),
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
