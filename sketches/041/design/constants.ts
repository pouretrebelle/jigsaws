export const GRID_COLUMNS = 20
export const GRID_ROWS = 28
export const COLOR_COUNT = 8

export const COLORS = [
  'hsl(15, 70%, 50%)',
  'hsl(90, 50%, 55%)',
  'hsl(140, 70%, 35%)',
  'hsl(168, 90%, 40%)',
  'hsl(213, 50%, 50%)',
  'hsl(240, 60%, 50%)',
  'hsl(281, 60%, 40%)',
  'hsl(320, 50%, 70%)',
  'hsl(330, 65%, 45%)',
  'hsl(355, 70%, 40%)',
]

const N: V = [0, -1]
const NE: V = [1, -1]
const E: V = [1, 0]
const SE: V = [1, 1]
const S: V = [0, 1]
const SW: V = [-1, 1]
const W: V = [-1, 0]
const NW: V = [-1, -1]

type V = [number, number]
interface Triangle {
  corners: [V, V]
  sampleDir: V
  comparisonDirs: [V, V]
}

/**
 * There are 8 triangles that make up a single unit
 * going from the middle to each cardinal and ordinal
 *
 * @property corners - the two points of the triangle besides the middle
 * @property sampleDir - the point of the colour sample
 * @property comparisonDirs - two points for colours sample which, when equal, override the main colour
 */
export const TRIANGLES: Record<string, Triangle> = {
  nne: {
    corners: [N, NE],
    sampleDir: N,
    comparisonDirs: [E, [1, -2]],
  },
  ene: {
    corners: [NE, E],
    sampleDir: E,
    comparisonDirs: [N, [2, -1]],
  },
  ese: {
    corners: [E, SE],
    sampleDir: E,
    comparisonDirs: [S, [2, 1]],
  },
  sse: {
    corners: [SE, S],
    sampleDir: S,
    comparisonDirs: [E, [1, 2]],
  },
  ssw: {
    corners: [S, SW],
    sampleDir: S,
    comparisonDirs: [W, [-1, 2]],
  },
  wsw: {
    corners: [SW, W],
    sampleDir: W,
    comparisonDirs: [S, [-2, 1]],
  },
  wnw: {
    corners: [W, NW],
    sampleDir: W,
    comparisonDirs: [N, [-2, -1]],
  },
  nnw: {
    corners: [NW, N],
    sampleDir: N,
    comparisonDirs: [W, [-1, -2]],
  },
}
