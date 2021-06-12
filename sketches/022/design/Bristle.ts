import SimplexNoise from 'simplex-noise'

import { map, randomFromNoise } from 'utils/numberUtils'
import Vector2 from 'utils/Vector2'

import {
  BRISTLE_MAX_WEIGHT,
  BRISTLE_MIN_WEIGHT,
  LIGHTNESS_VARIANCE,
} from './constants'

interface BristleConstructor {
  i: number
  layerI: number
  strokeI: number
  bristleSimplex: SimplexNoise
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
    hue,
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
    this.color = `hsl(${hue}, 100%, ${
      lightness + bristleSimplex.noise2D(strokeI, i) * LIGHTNESS_VARIANCE
    }%)`
  }
}

export default Bristle
