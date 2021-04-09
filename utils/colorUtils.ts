import chroma from 'chroma-js'
import { clamp } from './numberUtils'

export const hsl = (h: number, s: number, l: number): string =>
  `hsl(${h}, ${clamp(s, 0, 100)}%, ${clamp(l, 0, 100)}%)`

export const hsla = (h: number, s: number, l: number, a: number): string =>
  `hsl(${h}, ${clamp(s, 0, 100)}%, ${clamp(l, 0, 100)}%, ${clamp(a, 0, 1)})`

export const rotateHue = (
  color: string | chroma.Color,
  rotation: number
): string => {
  const c = typeof color === 'string' ? chroma(color) : color
  return c.set('hsl.h', (c.hsl()[0] + rotation) % 360).hex()
}
