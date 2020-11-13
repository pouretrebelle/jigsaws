import chroma from 'chroma-js'

import { Design } from 'types'
import { map, randomFromNoise } from 'utils/numberUtils'
import { hsl } from 'utils/colorUtils'

import Dot from './Dot'
import { COLOR_COUNT, DOT_COUNT, FLOW_FIDELITY, FRAMES } from './constants'

export enum Seeds {
  Flow,
  Color,
  Position,
  Curve,
}

const colorScale = chroma.scale('YlGnBu')

export const design = ({ c, simplex, width, height, noiseStart }: Design) => {
  const background = colorScale(0.6).brighten(1.5).luminance(0.3).hex()

  c.fillStyle = background
  c.fillRect(0, 0, width, height)
  c.lineCap = 'round'
  c.lineWidth = 1

  const dots: Dot[] = []
  for (let i = 0; i < DOT_COUNT; i++) {
    dots.push(
      new Dot({
        i,
        x: map(
          simplex[Seeds.Position].noise3D(Math.PI, i * 5, noiseStart * 0.3),
          -1,
          1,
          0,
          width
        ),
        y: map(
          simplex[Seeds.Position].noise3D(i * 5, Math.PI, noiseStart * 0.3),
          -1,
          1,
          0,
          height
        ),
        color: colorScale(map(i % COLOR_COUNT, 0, COLOR_COUNT - 1, 0, 1)).hex(),
        curveRandom: simplex[Seeds.Curve].noise2D(1 + i, noiseStart * 1),
      })
    )
  }

  const getFlowAngle = (dot: Dot): number => {
    const noiseX = map(dot.pos.x, 0, width, 0, FLOW_FIDELITY, true)
    const noiseY = map(dot.pos.y, 0, height, 0, FLOW_FIDELITY, true)

    return map(
      simplex[Seeds.Flow].noise2D(noiseX, noiseY),
      -1,
      1,
      -Math.PI,
      Math.PI * 3
    )
  }

  c.save()

  dots.forEach((dot, i) => {
    for (let t = 0; t < FRAMES; t++) {
      if (dot.canDraw(dots)) {
        dot.update(getFlowAngle(dot))
        dot.draw(c)
      }
    }
  })

  c.restore()
}
