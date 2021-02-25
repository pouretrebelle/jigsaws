import { Design } from 'types'
import { map, randomFromNoise } from 'utils/numberUtils'
import Vector2 from 'utils/Vector2'

import Stroke from './Stroke'
import {
  STROKES_PER_LAYER,
  STROKE_MIN_SIZE,
  STROKE_MAX_SIZE,
  FLOW_FIDELITY,
  STROKE_LENGTH,
  STROKE_OPACITY,
  DISTANCE_BETWEEN_POINTS,
  HUES,
  LAYER_COUNT,
  STROKE_SEPARATION_FIDELITY,
  LAYER_SHIFT,
  BRISTLES_PER_STROKE,
} from './constants'
import { arrayValuesFromSimplex } from 'utils/arrayUtils'

export enum Seeds {
  Flow,
  Position,
  Color,
  Size,
}

export const design = ({ c, simplex, width, height, noiseStart }: Design) => {
  const layerHues = arrayValuesFromSimplex(
    HUES,
    simplex[Seeds.Color],
    LAYER_COUNT + 1
  )
  const background = `hsl(${layerHues.shift()}, 70%, 40%)`
  const layers = layerHues.map((hue, hueI) => {
    const size = Math.round(
      map(
        randomFromNoise(simplex[Seeds.Size].noise2D(Math.PI, hueI * 5 - Math.PI)),
        0,
        1,
        STROKE_MIN_SIZE,
        STROKE_MAX_SIZE,
      )
    )
    let l = Math.round(
      map(
        randomFromNoise(simplex[Seeds.Color].noise2D(Math.PI+17.82, Math.PI + hueI * 5)),
        0,
        1,
        20,
        55
      )
    )
    if (l > 35) l += 20 // avoid the 10% around the background l
    return {
      color: `hsl(${hue}, 100%, ${l}%)`,
      size,
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
      getRandomLength(Math.PI + layerI * 10, Math.PI + i * STROKE_SEPARATION_FIDELITY),
      getRandomLength(Math.PI + i * STROKE_SEPARATION_FIDELITY, Math.PI + layerI * 10)
    )

  const getBristlePositions = (layerI: number, strokeI: number): Vector2[] => Array.from(Array(BRISTLES_PER_STROKE)).map((_, i) => new Vector2(
    randomFromNoise(simplex[Seeds.Position].noise3D(layerI - 42.33, strokeI + Math.PI, i + Math.PI)) - 0.5,
    randomFromNoise(simplex[Seeds.Position].noise3D(layerI + 17.4, i + Math.PI, strokeI + Math.PI)) - 0.5,
  )).filter(v => v.magnitude() <= 0.5)


  c.save()

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = c.canvas.width
  tempCanvas.height = c.canvas.height
  const tempC = tempCanvas.getContext('2d') as CanvasRenderingContext2D
  tempC.setTransform(c.getTransform())
  tempC.globalAlpha = STROKE_OPACITY

  layers.forEach(({ color, size, composite, opacity }, layerI) => {
    const layerCanvas = document.createElement('canvas')
    layerCanvas.width = c.canvas.width
    layerCanvas.height = c.canvas.height
    const layerC = layerCanvas.getContext('2d') as CanvasRenderingContext2D
    layerC.setTransform(c.getTransform())
    layerC.globalAlpha = STROKE_OPACITY

    const strokes: Stroke[] = []
    for (let i = 0; i < STROKES_PER_LAYER; i++) {
      const stroke = new Stroke({
        i,
        pos: getRandomPos(i, layerI),
        color,
        size,
      })

      for (let t = 0; t < STROKE_LENGTH; t += DISTANCE_BETWEEN_POINTS) {
        stroke.update(getFlowAngle(stroke, layerI))
      }
      strokes.push(stroke)
    }

    strokes.forEach((stroke, strokeI) => {
      stroke.draw({ layerC, tempC, width, height, bristlePositions: getBristlePositions(layerI, strokeI) })
    })

    c.globalAlpha = opacity
    c.globalCompositeOperation = composite
    c.drawImage(layerCanvas, 0, 0, width, height)
  })

  c.restore()
}
