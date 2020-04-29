export const makeRandomSeed = (): string =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 3)

export const makeRandomSeedArray = (length: number): string[] =>
  Array.from({ length }, makeRandomSeed)
