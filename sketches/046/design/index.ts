import chroma from 'chroma-js'
import { Design } from 'types'
import { arrayValueFromRandom } from 'utils/arrayUtils'
import { map, randomFromNoise, signFromRandom } from 'utils/numberUtils'
import Vector2 from 'utils/Vector2'

import {
  CIRCLE_COUNT,
  CIRCLE_LAYER_COUNT,
  CIRCLE_MAX_RADIUS,
  CIRCLE_MIN_RADIUS,
  CIRCLE_OPACITY_CLAMP_RADIUS,
  COLOR_COUNT,
  SPIN_CIRCLE_COUNT,
  SPIN_CIRCLE_MAX_RADIUS,
  SPIN_CIRCLE_MAX_ROTATION,
  SPIN_CIRCLE_MIN_RADIUS,
  SPIN_CIRCLE_MIN_ROTATION,
} from './constants'

export enum Seeds {
  Color,
  Position,
  Rotation,
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
  createCanvas,
}: Design) => {
  const bigCanvas = createCanvas(c.canvas.width * 2, c.canvas.height * 2)
  const bigC = bigCanvas.getContext('2d') as CanvasRenderingContext2D
  bigC.setTransform(c.getTransform())

  const startHue = Math.floor(
    map(
      randomFromNoise(simplex[Seeds.Color].noise2D(1.456, 5.234)),
      0,
      1,
      160,
      300
    )
  )
  const hueRotation = Math.floor(
    map(
      randomFromNoise(simplex[Seeds.Color].noise2D(17.23, 5.241)),
      0,
      1,
      40,
      70
    )
  )
  const hues: number[] = []
  for (let hueI = 0; hueI < COLOR_COUNT + 1; hueI++) {
    hues.push((startHue + hueRotation * hueI) % 360)
  }

  bigC.fillStyle = chroma.lch(60, 40, hues[0]).hex()
  bigC.fillRect(0, 0, width * 2, height * 2)
  bigC.translate(width / 2, height / 2)
  bigC.save()

  const circles: Circle[] = []

  for (
    let circleI = 0;
    circleI < CIRCLE_COUNT * CIRCLE_LAYER_COUNT;
    circleI++
  ) {
    const x = map(
      simplex[Seeds.Position].noise2D(circleI * 5 + 5.42, 78.1),
      -0.5,
      0.5,
      0,
      width
    )
    const y = map(
      simplex[Seeds.Position].noise2D(circleI * 5 + 123.4, 23.1),
      -0.5,
      0.5,
      0,
      height
    )
    const maxRadius = map(
      Math.pow(simplex[Seeds.Size].noise2D(circleI * 50, 123.45), 2),
      0,
      1,
      CIRCLE_MIN_RADIUS,
      CIRCLE_MAX_RADIUS
    )

    const hue = arrayValueFromRandom(
      hues,
      randomFromNoise(simplex[Seeds.Color].noise2D(circleI, 0))
    )
    let color = chroma.lch(60, 60, hue)
    color = color.brighten(simplex[Seeds.Color].noise2D(circleI * 3.5, 4.6) * 3)

    const circle = {
      pos: new Vector2(x, y),
      maxRadius,
      color: color.hex(),
    }
    circles.push(circle)
  }

  for (let circleLayer = 0; circleLayer < CIRCLE_LAYER_COUNT; circleLayer++) {
    for (let radius = 3; radius < CIRCLE_MAX_RADIUS; radius++) {
      bigC.globalAlpha = map(
        radius,
        0,
        CIRCLE_OPACITY_CLAMP_RADIUS,
        0.1,
        0.02,
        true
      )
      for (let circleI = 0; circleI < CIRCLE_COUNT; circleI++) {
        const circle = circles[circleI + circleLayer * CIRCLE_COUNT]
        if (radius < circle.maxRadius) {
          bigC.fillStyle = circle.color
          bigC.beginPath()
          bigC.arc(circle.pos.x, circle.pos.y, radius, 0, 2 * Math.PI)
          bigC.fill()
        }
      }
    }
  }
  bigC.restore()

  const tempCanvas = createCanvas(c.canvas.width, c.canvas.height)
  const tempC = tempCanvas.getContext('2d') as CanvasRenderingContext2D
  tempC.setTransform(c.getTransform())

  for (let spinCircleI = 0; spinCircleI < SPIN_CIRCLE_COUNT; spinCircleI++) {
    const x = map(
      randomFromNoise(
        simplex[Seeds.Position].noise2D(spinCircleI * 12 + 0.5, 123.45)
      ),
      0,
      1,
      0,
      width
    )
    const y = map(
      randomFromNoise(
        simplex[Seeds.Position].noise2D(123.45, spinCircleI * 12 + 0.5)
      ),
      0,
      1,
      0,
      height
    )
    const radius = map(
      simplex[Seeds.Size].noise2D(spinCircleI * 50, 123.45),
      -1,
      1,
      SPIN_CIRCLE_MIN_RADIUS,
      SPIN_CIRCLE_MAX_RADIUS
    )
    const rotationRandom = simplex[Seeds.Rotation].noise2D(
      43.21 + noiseStart,
      spinCircleI * 12 + 0.5
    )

    const rotation =
      map(
        rotationRandom,
        -1,
        1,
        SPIN_CIRCLE_MIN_ROTATION,
        SPIN_CIRCLE_MAX_ROTATION
      ) *
      signFromRandom(
        simplex[Seeds.Rotation].noise2D(43.21, spinCircleI * 12 + 0.5)
      )

    tempC.save()
    tempC.translate(x, y)
    tempC.rotate(rotation)
    tempC.translate(-x, -y)
    tempC.drawImage(bigC.canvas, -width / 2, -height / 2, width * 2, height * 2)
    tempC.restore()

    bigC.save()
    bigC.beginPath()
    bigC.arc(x, y, radius, 0, 2 * Math.PI)
    bigC.clip()
    bigC.drawImage(tempC.canvas, 0, 0, width, height)
    bigC.restore()
  }

  c.drawImage(bigC.canvas, -width / 2, -height / 2, width * 2, height * 2)
}
