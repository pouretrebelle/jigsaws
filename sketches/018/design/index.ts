import { Design } from 'types'
import { map, randomFromNoise } from 'utils/numberUtils'
import Vector2 from 'utils/Vector2'

import Stroke from './Stroke'
import {
  STROKE_ATTEMPTS,
  FLOW_FIDELITY,
  LENGTH_VARIATION,
  MAX_LENGTH,
  MIN_LENGTH,
  DISTANCE_PER_FRAME,
  LAYER_SHIFT,
  HUES,
  LAYER_COUNT,
} from './constants'
import { arrayValuesFromSimplex } from 'utils/arrayUtils'

export enum Seeds {
  Flow,
  Position,
  Length,
  Color,
}

export const design = ({ c, simplex, width, height, noiseStart }: Design) => {
  const layerHues = arrayValuesFromSimplex(
    HUES,
    simplex[Seeds.Color],
    LAYER_COUNT + 1
  )
  const background = `hsl(${layerHues.shift()}, 30%, 40%)`
  const layers = layerHues.map((hue, hueI) => {
    const l = Math.round(
      map(
        randomFromNoise(simplex[Seeds.Color].noise2D(Math.PI, Math.PI + hueI)),
        0,
        1,
        20,
        60
      )
    )
    return {
      color: `hsl(${hue}, 100%, ${l}%)`,
      composite: l < 50 ? 'screen' : 'multiply',
      opacity: 1,
    }
  })

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
      getRandomLength(Math.PI + layerI * 2, i * 0.01),
      getRandomLength(i * 0.01, Math.PI + layerI * 2)
    )

  c.save()

  layers.forEach(({ color, composite, opacity }, layerI) => {
    const layerCanvas = document.createElement('canvas')
    layerCanvas.width = c.canvas.width
    layerCanvas.height = c.canvas.height
    const layerC = layerCanvas.getContext('2d') as CanvasRenderingContext2D
    layerC.setTransform(c.getTransform())

    const strokes: Stroke[] = []
    for (let i = 0; i < STROKE_ATTEMPTS; i++) {
      const strokeLength = map(
        simplex[Seeds.Length].noise2D(i * 5, Math.PI * 2),
        -1,
        1,
        MAX_LENGTH,
        MAX_LENGTH - LENGTH_VARIATION
      )

      const stroke = new Stroke({
        i,
        pos: getRandomPos(i, layerI),
        color,
      })

      for (let t = 0; t < strokeLength; t += DISTANCE_PER_FRAME) {
        if (stroke.canDraw(strokes)) {
          stroke.update(getFlowAngle(stroke, layerI))
        }
      }

      if (stroke.length > MIN_LENGTH) {
        strokes.push(stroke)
      }
    }

    strokes.forEach((stroke) => stroke.draw(layerC, strokes))

    c.globalAlpha = opacity
    c.globalCompositeOperation = composite
    c.drawImage(layerCanvas, 0, 0, width, height)
  })

  c.restore()
}
