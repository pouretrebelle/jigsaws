import Vector2 from 'utils/Vector2'

import {
  BRISTLE_WEIGHT,
  DISTANCE_BETWEEN_POINTS,
} from './constants'

interface StrokeConstructor {
  i: number
  pos: Vector2
  color: string
  size: number
}

interface Point {
  x: number
  y: number
  angle?: number
}

const temp = new Vector2()

class Stroke {
  i: number
  color: string
  size: number
  pos: Vector2
  points: Point[]
  vel: Vector2
  length: number = 0
  initialAngle: number

  constructor({ i, pos, color, size }: StrokeConstructor) {
    this.i = i
    this.color = color
    this.size = size
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

  draw({ layerC: c, tempC, width, height, bristlePositions }: { layerC: CanvasRenderingContext2D, tempC: CanvasRenderingContext2D, width: number, height: number, bristlePositions: Vector2[] }) {
    c.save()
    c.fillStyle = this.color

    tempC.save()
    tempC.fillStyle = this.color

    tempC.translate(this.size / 2, this.size / 2)
    bristlePositions.forEach(bristlePos => {
      tempC.beginPath()
      tempC.arc(bristlePos.x * this.size, bristlePos.y * this.size, BRISTLE_WEIGHT, 0, Math.PI * 2)
      tempC.fill()
    })

    this.points.slice(1).forEach(({ x, y, angle }, i) => {
      c.drawImage(tempC.canvas, x - this.size / 2, y - this.size / 2, width, height);
    })

    tempC.restore()
    c.restore()
  }
}

export default Stroke
