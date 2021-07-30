import chroma from 'chroma-js'
import { Design } from 'types'
import { arrayValueFromRandom } from 'utils/arrayUtils'
import { map, randomFromNoise } from 'utils/numberUtils'
import Vector2 from 'utils/Vector2'

import {
  CIRCLE_COUNT,
  CIRCLE_MAX_RADIUS,
  CIRCLE_MIN_RADIUS,
  CIRCLE_OPACITY_CLAMP_RADIUS,
  COLOR_COUNT,
} from './constants'

export enum Seeds {
  Color,
  Position,
  Size,
}

interface Circle {
  pos: Vector2
  maxRadius: number
  color: string
}

export const design = ({
  c,
  simplex,
  width,
  height,
  bleed,
  noiseStart,
}: Design) => {
  c.save()

  const hues: number[] = []
  for (let hueI = 0; hueI < COLOR_COUNT + 1; hueI++) {
    hues.push(
      Math.floor(
        randomFromNoise(simplex[Seeds.Color].noise2D(235.25 + hueI, 123.33)) *
          360
      )
    )
  }

  c.fillStyle = `hsl(${hues[0]}, 50%, 50%)`
  c.fillRect(0, 0, width, height)

  const circles: Circle[] = []

  let clusterSeparator = 0
  for (let circleI = 0; circleI < CIRCLE_COUNT; circleI++) {
    if (
      randomFromNoise(simplex[Seeds.Position].noise2D(circleI * 43.21, 123.2)) >
      0.6
    ) {
      clusterSeparator++
    }
    const posDifferentiator = circleI * 0.02 + clusterSeparator * 6.3

    const x = map(
      simplex[Seeds.Position].noise3D(posDifferentiator + 0.5, 0.5, noiseStart),
      -0.6,
      0.6,
      0,
      width
    )
    const y = map(
      simplex[Seeds.Position].noise3D(0.5, posDifferentiator + 0.5, noiseStart),
      -0.6,
      0.6,
      0,
      height
    )

    const maxRadius = map(
      Math.pow(
        simplex[Seeds.Size].noise2D(circleI * 50, 123.45 + noiseStart * 0.5),
        3
      ),
      0,
      1,
      CIRCLE_MIN_RADIUS,
      CIRCLE_MAX_RADIUS
    )

    const hue = arrayValueFromRandom(
      hues,
      randomFromNoise(simplex[Seeds.Color].noise2D(circleI, 0))
    )
    let color = chroma(`hsl(${hue}, 70%, 60%)`)
    if (color.luminance() > 0.3) {
      color = color.luminance(0.3)
    }
    color = color.brighten(simplex[Seeds.Color].noise2D(circleI * 3.5, 4.6) * 4)

    const circle = {
      pos: new Vector2(x, y),
      maxRadius,
      color: color.hex(),
    }
    circles.push(circle)
  }

  c.globalAlpha = 0.02

  for (let radius = 5; radius < CIRCLE_MAX_RADIUS; radius++) {
    c.globalAlpha = map(
      radius,
      0,
      CIRCLE_OPACITY_CLAMP_RADIUS,
      0.06,
      0.02,
      true
    )
    circles.forEach((circle) => {
      if (radius < circle.maxRadius) {
        c.fillStyle = circle.color
        c.beginPath()
        c.arc(circle.pos.x, circle.pos.y, radius, 0, 2 * Math.PI)
        c.fill()
      }
    })
  }

  c.restore()
}
