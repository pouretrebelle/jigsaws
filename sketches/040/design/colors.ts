import chroma from 'chroma-js'
import SimplexNoise from 'simplex-noise'

import { arrayValueFromRandom } from 'utils/arrayUtils'
import { randomFromNoise } from 'utils/numberUtils'

export const getContrastingColorScale = (
  colors: string[],
  simplex: SimplexNoise,
  count: number
): string[] => {
  let result = [
    arrayValueFromRandom(colors, randomFromNoise(simplex.noise2D(Math.PI, 0))),
  ]

  while (result.length < count) {
    const latest = result[result.length - 1]

    const contrastingColors = colors.filter(
      (c) =>
        c !== result[result.length - 2] &&
        chroma.contrast(chroma(latest), chroma(c)) > 1.5
    )

    result.push(
      arrayValueFromRandom(
        contrastingColors,
        randomFromNoise(simplex.noise2D(Math.PI, result.length * 10))
      )
    )
  }

  return result
}
