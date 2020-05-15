import { clamp } from './numberUtils'

export const hsl = (h: number, s: number, l: number): string =>
  `hsl(${h}, ${clamp(s, 0, 100)}%, ${clamp(l, 0, 100)}%)`
