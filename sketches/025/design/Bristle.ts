import SimplexNoise from 'simplex-noise'

import { clamp, map, randomFromNoise } from 'utils/numberUtils'
import Vector2 from 'utils/Vector2'

import {
  BRISTLE_MAX_WEIGHT,
  BRISTLE_MIN_WEIGHT,
  BRISTLE_LIGHTNESS_VARIANCE,
  STROKE_LIGHTNESS_VARIANCE,
  BRISTLE_LIGHTNESS_SHIFT,
  STROKE_LIGHTNESS_SHIFT,
  STROKE_HUE_VARIANCE,
  STROKE_HUE_SHIFT,
} from './constants'

interface BristleConstructor {
  i: number
  layerI: number
  strokeI: number
  bristleSimplex: SimplexNoise
  colorSimplex: SimplexNoise
  hue: number
  lightness: number
}

class Bristle {
  pos: Vector2
  weight: number
  color: string

  constructor({
    i,
    layerI,
    strokeI,
    bristleSimplex,
    colorSimplex,
    hue: startingHue,
    lightness,
  }: BristleConstructor) {
    this.pos = new Vector2(
      randomFromNoise(
        bristleSimplex.noise3D(layerI - 42.33, strokeI + Math.PI, i + Math.PI)
      ) - 0.5,
      randomFromNoise(
        bristleSimplex.noise3D(layerI + 17.4, i + Math.PI, strokeI + Math.PI)
      ) - 0.5
    )
    this.weight = map(
      randomFromNoise(bristleSimplex.noise3D(layerI, strokeI, i * 20)),
      0,
      1,
      BRISTLE_MIN_WEIGHT,
      BRISTLE_MAX_WEIGHT
    )

    const hue =
      startingHue +
      colorSimplex.noise2D(strokeI * STROKE_HUE_SHIFT, layerI) *
        STROKE_HUE_VARIANCE

    let l =
      lightness +
      colorSimplex.noise2D(layerI, strokeI * STROKE_LIGHTNESS_SHIFT) *
        STROKE_LIGHTNESS_VARIANCE

    if (hue > 300 && l > 40) l -= 10 // pull down pinks
    if (hue < 200 && l > 50) l -= 20 // pull down greens

    let s = map(l, 100, 40, 60, 100, true)
    s = map(l, 100, 70, 60, s, true)

    if (hue > 300) s -= 10 // pull down pinks
    if (hue > 220 && hue < 275 && l < 60) l += 10 // pull up blues

    l +=
      colorSimplex.noise2D(
        strokeI * BRISTLE_LIGHTNESS_SHIFT,
        i * BRISTLE_LIGHTNESS_SHIFT
      ) * BRISTLE_LIGHTNESS_VARIANCE

    l = clamp(l, 20, 90)

    this.color = `hsl(${hue}, ${s.toFixed(2)}%, ${l.toFixed(2)}%)`
  }
}

export default Bristle
