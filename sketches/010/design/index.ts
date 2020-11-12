import { Design } from 'types'
import { map, randomFromNoise } from 'utils/numberUtils'
import { hsl } from 'utils/colorUtils'

import Dot from './Dot'
import { DOT_COUNT, FLOW_FIDELITY, FRAMES, PRETTY_HUES } from './constants'
import { arrayValueFromRandom } from 'utils/arrayUtils'

export enum Seeds {
  Flow,
  Color,
  Position,
  Curve,
}

const getColorFromHue = (hue: number): string => {
  let sat = 100
  let bri = 70
  if (hue < 200 && hue > 40) {
    sat = 80
    bri = 60
  }
  return hsl(hue, sat, bri)
}

export const design = ({ c, simplex, width, height, noiseStart }: Design) => {
  const backgroundHue = arrayValueFromRandom(
    PRETTY_HUES,
    randomFromNoise(simplex[Seeds.Color].noise2D(1, 1))
  )
  const background = getColorFromHue(backgroundHue)

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
        color: '#fff',
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
