import { Design } from 'types'
import { map, randomFromNoise } from 'utils/numberUtils'

import Stroke from './Stroke'
import {
  BACKGROUND,
  DOT_COUNT,
  FLOW_FIDELITY,
  LENGTH_VARIATION,
  MAX_LENGTH,
} from './constants'

export enum Seeds {
  Flow,
  Position,
  Curve,
  Length,
}

export const design = ({ c, simplex, width, height, noiseStart }: Design) => {
  c.fillStyle = BACKGROUND
  c.fillRect(0, 0, width, height)
  c.lineCap = 'round'
  c.lineWidth = 1

  const getFlowAngle = (stroke: Stroke): number => {
    const noiseX = map(stroke.pos.x, 0, width, 0, FLOW_FIDELITY, true)
    const noiseY = map(stroke.pos.y, 0, height, 0, FLOW_FIDELITY, true)

    return map(
      simplex[Seeds.Flow].noise3D(noiseX, noiseY, noiseStart * 0.5),
      -1,
      1,
      -Math.PI,
      Math.PI * 3
    )
  }

  c.save()

  const strokes: Stroke[] = []
  for (let i = 0; i < DOT_COUNT; i++) {
    const strokeLength = map(
      simplex[Seeds.Length].noise2D(i * 5, Math.PI * 2),
      -1,
      1,
      MAX_LENGTH,
      MAX_LENGTH - LENGTH_VARIATION
    )

    const stroke = new Stroke({
      i,
      x: map(randomFromNoise(simplex[Seeds.Position].noise2D(Math.PI, i * 5)), 0, 1, 0, width),
      y: map(randomFromNoise(simplex[Seeds.Position].noise2D(i * 5, Math.PI)), 0, 1, 0, height),
      curveRandom: simplex[Seeds.Curve].noise2D(1 + i, noiseStart),
    })

    for (let t = 0; t < strokeLength; t++) {
      if (stroke.canDraw(strokes)) {
        stroke.update(getFlowAngle(stroke))
      }
      stroke.draw(c)
    }

    strokes.push(stroke)
  }

  c.restore()
}
