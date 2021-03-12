import { Design } from 'types'
import { map, randomFromNoise } from 'utils/numberUtils'
import Vector2 from 'utils/Vector2'

import Stroke from './Stroke'
import Bristle from './Bristle'
import {
  STROKES_PER_LAYER,
  STROKE_MIN_SIZE,
  STROKE_MAX_SIZE,
  FLOW_FIDELITY,
  STROKE_MIN_LENGTH,
  STROKE_MAX_LENGTH,
  STROKE_OPACITY,
  DISTANCE_BETWEEN_POINTS,
  HUES,
  LAYER_COUNT,
  STROKE_SEPARATION_FIDELITY,
  LAYER_SHIFT,
  STROKE_SIZE_VARIANCE,
  LAYER_LOOP_COUNT,
} from './constants'
import { arrayValuesFromSimplex } from 'utils/arrayUtils'

export enum Seeds {
  Flow,
  Position,
  Color,
  Size,
  Length,
  Bristle,
}

export const design = ({ c, simplex, width, height, noiseStart }: Design) => {
  const layerHues = arrayValuesFromSimplex(
    HUES,
    simplex[Seeds.Color],
    LAYER_COUNT + 1
  )
  const layers = layerHues.map((hue, hueI) => {
    let l = Math.round(
      map(
        randomFromNoise(simplex[Seeds.Color].noise2D(Math.PI + 17.82, Math.PI + hueI * 5)),
        0,
        1,
        30,
        55
      )
      )
      if (hue > 100 && hue < 190 && l > 40) l -= 10 // pull down aggressive greens
      return {
        hue,
        lightness: l,
        opacity: 1,
      }
    })
  const background = `hsl(${layers[layers.length-1].hue}, 100%, 30%)`

  c.fillStyle = background
  c.fillRect(0, 0, width, height)
  c.lineCap = 'round'
  c.lineWidth = 1

  const getFlowAngle = (stroke: Stroke, layerI: number): number => {
    const noiseX = map(stroke.pos.x, 0, width, 0, FLOW_FIDELITY, true)
    const noiseY = map(stroke.pos.y, 0, height, 0, FLOW_FIDELITY, true)

    return map(
      simplex[Seeds.Flow].noise3D(
        noiseX,
        noiseY,
        noiseStart * 0.02 + layerI * LAYER_SHIFT
      ),
      -1,
      1,
      -Math.PI,
      Math.PI * 3
    )
  }

  const getRandomLength = (a: number, b: number) =>
    map(simplex[Seeds.Position].noise2D(a, b), -0.7, 0.7, 0, width)

  const getRandomPos = (i: number, layerI: number): Vector2 =>
    new Vector2(
      getRandomLength(layerI, layerI * 4 + i * STROKE_SEPARATION_FIDELITY),
      getRandomLength(layerI * 4 + i * STROKE_SEPARATION_FIDELITY, layerI)
    )

  c.save()

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = c.canvas.width
  tempCanvas.height = c.canvas.height
  const tempC = tempCanvas.getContext('2d') as CanvasRenderingContext2D
  tempC.setTransform(c.getTransform())
  tempC.globalAlpha = STROKE_OPACITY

  for (let layerLoopI = 0; layerLoopI < LAYER_LOOP_COUNT; layerLoopI++) {
    layers.forEach(({ hue, lightness, opacity }, layerI) => {
      const layerCanvas = document.createElement('canvas')
      layerCanvas.width = c.canvas.width
      layerCanvas.height = c.canvas.height
      const layerC = layerCanvas.getContext('2d') as CanvasRenderingContext2D
      layerC.setTransform(c.getTransform())
      layerC.globalAlpha = STROKE_OPACITY

      const strokes: Stroke[] = []
      for (let strokeI = 0; strokeI < STROKES_PER_LAYER; strokeI++) {
        const size = Math.round(
          map(
            randomFromNoise(simplex[Seeds.Size].noise2D(layerI, strokeI)),
            0,
            1,
            STROKE_MIN_SIZE,
            STROKE_MAX_SIZE,
          )
        )
        const bristleCount = Math.round(size * 3)
        const bristles = Array.from(Array(Math.ceil(map(size, 0, STROKE_MAX_SIZE, 0, bristleCount)))).map((_, i) => new Bristle({
          i, layerI, strokeI, bristleSimplex: simplex[Seeds.Bristle], hue, lightness
        })).filter(v => v.pos.magnitude() <= 0.5)

        const stroke = new Stroke({
          i: strokeI,
          pos: getRandomPos(strokeI, layerI + layerLoopI*layers.length),
          size,
          bristles
        })
        const length = map(
          randomFromNoise(simplex[Seeds.Length].noise2D(
            layerI,
            strokeI,
          )),
          0,
          1,
          STROKE_MIN_LENGTH,
          STROKE_MAX_LENGTH,
        )

        for (let t = 0; t < length; t += DISTANCE_BETWEEN_POINTS) {
          stroke.update(getFlowAngle(stroke, layerI + layerLoopI * layers.length), simplex[Seeds.Size].noise3D(layerI, strokeI, t * 0.01) * STROKE_SIZE_VARIANCE)
        }
        strokes.push(stroke)
      }

      strokes.forEach((stroke) => {
        stroke.draw({
          layerC, tempC, width, height
        })

        c.globalAlpha = opacity
      })
      c.drawImage(layerCanvas, 0, 0, width, height)
    })
  }
  c.restore()
}
