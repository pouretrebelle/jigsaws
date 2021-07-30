import { Design } from 'types'
import { map, randomFromNoise } from 'utils/numberUtils'
import Vector2 from 'utils/Vector2'

import {
  CIRCLE_COUNT,
  CIRCLE_MAX_RADIUS,
  CIRCLE_MIN_RADIUS,
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

  for (let circleI = 0; circleI < CIRCLE_COUNT; circleI++) {
    const x = map(
      simplex[Seeds.Position].noise3D(circleI + 0.5, 0.5, noiseStart * 0.1),
      -0.6,
      0.6,
      0,
      width
    )
    const y = map(
      simplex[Seeds.Position].noise3D(0.5, circleI + 0.5, noiseStart * 0.1),
      -0.6,
      0.6,
      0,
      height
    )

    const circle = {
      pos: new Vector2(x, y),
      maxRadius: map(
        simplex[Seeds.Size].noise2D(circleI * 50, 123.45 + noiseStart * 0.1),
        -1,
        1,
        CIRCLE_MIN_RADIUS,
        CIRCLE_MAX_RADIUS
      ),
      color: `hsl(${hues[circleI % hues.length]}, 50%, 50%)`,
    }
    circles.push(circle)
  }

  c.globalAlpha = 0.02

  for (let radius = 0; radius < CIRCLE_MAX_RADIUS; radius += 2) {
    circles.forEach((circle, circleI) => {
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
