import { Design } from 'types'
import { map, randomFromNoise } from 'utils/numberUtils'
import { hsl } from 'utils/colorUtils'

import Dot from './Dot'
import { PRETTY_HUES } from './constants'
import { arrayValueFromRandom, arrayValuesFromSimplex } from 'utils/arrayUtils'

const COLOR_COUNT = 7
const DOT_COUNT = 14
const DOT_MIN_SIZE = 5
const DOT_MAX_SIZE = 40
const DOT_MIN_LENGTH = 20
const DOT_MAX_LENGTH = 60

export enum Seeds {
  Color,
  Position,
  Length,
  Size,
  Curve,
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
          simplex[Seeds.Position].noise3D(Math.PI, i * 5, noiseStart * 0.3),
          -1,
          1,
          0,
          width
        ),
        y: map(
          simplex[Seeds.Position].noise3D(i * 5, Math.PI, noiseStart * 0.3),
          -1,
          1,
          0,
          height
        ),
        color: dotColors[i % dotColors.length],
        maxFrames: Math.floor(
          map(
            randomFromNoise(simplex[Seeds.Length].noise2D(1, i * 10)),
            0,
            1,
            DOT_MIN_LENGTH,
            DOT_MAX_LENGTH
          )
        ),
        curveRandom: simplex[Seeds.Curve].noise2D(1 + i, noiseStart * 1),
        startAngleRandom: simplex[Seeds.Curve].noise2D(0, i),
        sizeFunc: (frame: number) =>
          map(
            simplex[Seeds.Size].noise3D(i, noiseStart * 2, frame * 0.02),
            -1,
            1,
            DOT_MIN_SIZE,
            DOT_MAX_SIZE
          ),
        changeDirFunc: (frame: number) =>
          simplex[Seeds.Curve].noise2D(1 + i, frame * 0.1),
      })
    )
  }

  for (let t = 0; t < DOT_MAX_LENGTH; t++) {
    dots.forEach((dot, i) => {
      if (dot.shouldDraw()) {
        dot.draw(c, false)
        dot.update()
      }
    })
  }

  for (let t = 0; t < DOT_MAX_LENGTH; t++) {
    dots.forEach((dot, i) => {
      if (dot.frame > 0) {
        dot.draw(c, true)
        dot.updateBackward()
      }
    })
  }
}
