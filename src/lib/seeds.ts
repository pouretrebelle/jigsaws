import { SketchContent } from 'types'

export const makeRandomSeed = (): string =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 3)

export const makeRandomSeedArray = (length: number): string[] =>
  Array.from({ length }, makeRandomSeed)

export const setLocalStorageSeeds = (
  sketch: Pick<SketchContent, 'cutNoiseSeeds' | 'designNoiseSeeds'>
) => {
  localStorage.setItem('cutNoiseSeeds', JSON.stringify(sketch.cutNoiseSeeds))
  localStorage.setItem(
    'designNoiseSeeds',
    JSON.stringify(sketch.designNoiseSeeds)
  )
}
