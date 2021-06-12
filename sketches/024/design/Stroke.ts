import { map } from 'utils/numberUtils'
import Vector2 from 'utils/Vector2'
import Bristle from './Bristle'

import { BRISTLE_OPACITY, DISTANCE_BETWEEN_POINTS } from './constants'

interface StrokeConstructor {
  i: number
  pos: Vector2
  size: number
  bristles: Bristle[]
}

interface Point {
  x: number
  y: number
  angle?: number
  sizeRatio: number
}

class Stroke {
  i: number
  size: number
  bristles: Bristle[]
  pos: Vector2
  points: Point[]
  vel: Vector2
  length: number = 0
  initialAngle: number

  constructor({ i, pos, size, bristles }: StrokeConstructor) {
    this.i = i
    this.size = size
    this.bristles = bristles
    this.initialAngle = 0

    this.pos = pos
    this.points = [{ x: pos.x, y: pos.y, sizeRatio: 0 }]
    this.vel = new Vector2()
  }

  update(angle: number, sizeVariance: number) {
    if (this.length === 0) {
      this.initialAngle = angle
    }

    this.vel.reset(DISTANCE_BETWEEN_POINTS, 0).rotate(angle)
    this.pos.plusEq(this.vel)

    this.points.push({
      x: this.pos.x,
      y: this.pos.y,
      angle: this.vel.angle(),
      sizeRatio: 1 + sizeVariance,
    })

    this.length += DISTANCE_BETWEEN_POINTS
  }

  draw({
    layerC: c,
    tempC,
    width,
    height,
  }: {
    layerC: CanvasRenderingContext2D
    tempC: CanvasRenderingContext2D
    width: number
    height: number
  }) {
    c.save()

    tempC.save()
    tempC.globalAlpha = BRISTLE_OPACITY

    tempC.translate(width / 2, height / 2)
    this.bristles.forEach((bristle) => {
      tempC.fillStyle = bristle.color
      tempC.beginPath()
      tempC.arc(
        bristle.pos.x * this.size,
        bristle.pos.y * this.size,
        bristle.weight / 2,
        0,
        Math.PI * 2
      )
      tempC.fill()
    })

    this.points.forEach(({ x, y, sizeRatio }, i) => {
      let stampSizeRatio = sizeRatio
      // pull in the start of the stroke
      if (i <= 40)
        stampSizeRatio *= Math.sin(map(i, 0, 40, Math.PI / 4, Math.PI / 2))
      // pull in the end of the stroke
      if (i >= this.points.length - 40)
        stampSizeRatio *= Math.sin(
          map(
            i,
            this.points.length,
            this.points.length - 40,
            Math.PI / 4,
            Math.PI / 2
          )
        )

      const stampWidth = width * stampSizeRatio
      const stampHeight = height * stampSizeRatio
      c.drawImage(
        tempC.canvas,
        x - this.size - stampWidth / 2,
        y - this.size - stampHeight / 2,
        stampWidth,
        stampHeight
      )
    })

    tempC.restore()
    tempC.clearRect(0, 0, width, height)
    c.restore()
  }
}

export default Stroke
