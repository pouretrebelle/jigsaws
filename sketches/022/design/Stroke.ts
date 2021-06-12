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
    this.points = [{ x: pos.x, y: pos.y }]
    this.vel = new Vector2()
  }

  update(angle: number) {
    if (this.length === 0) {
      this.initialAngle = angle
    }

    this.vel.reset(DISTANCE_BETWEEN_POINTS, 0).rotate(angle)
    this.pos.plusEq(this.vel)

    this.points.push({
      x: this.pos.x,
      y: this.pos.y,
      angle: this.vel.angle(),
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

    tempC.translate(this.size, this.size)
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

    this.points.forEach(({ x, y }, i) => {
      c.drawImage(tempC.canvas, x - this.size, y - this.size, width, height)
    })

    tempC.restore()
    tempC.clearRect(0, 0, width, height)
    c.restore()
  }
}

export default Stroke
