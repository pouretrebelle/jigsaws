import SimplexNoise from 'simplex-noise'

import { clamp, randomFromNoise } from './numberUtils'

export const arrayValueFromRandom = <T>(array: T[], random: number): T =>
  array[Math.floor(clamp(random, 0, 1) * array.length)]

export const arrayValuesFromSimplex = <T>(
  array: T[],
  simplex: SimplexNoise,
  count: number
): T[] => {
  const loops = Math.ceil(count / array.length)
  let all: T[] = []
  for (let i = 0; i < loops; i++) {
    all.push(...array)
  }
  const chosen: T[] = []

  let num = count
  while (num) {
    const random = randomFromNoise(simplex.noise2D(1, num * 1000))
    chosen.push(all.splice(Math.floor(random * all.length), 1)[0])
    num--
  }

  return chosen
}
