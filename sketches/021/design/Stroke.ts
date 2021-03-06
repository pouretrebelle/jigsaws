import Vector2 from 'utils/Vector2'

import { DISTANCE_BETWEEN_RIBS, RIB_WEIGHT } from './constants'

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

    this.vel.reset(DISTANCE_BETWEEN_RIBS, 0).rotate(angle)
    this.pos.plusEq(this.vel)

    this.points.push({
      x: this.pos.x,
      y: this.pos.y,
      angle: this.vel.angle(),
    })

    this.length += DISTANCE_BETWEEN_RIBS
  }

  draw(c: CanvasRenderingContext2D, strokes: Stroke[]) {
    c.save()
    c.fillStyle = this.color

    this.points.slice(1).forEach(({ x, y, angle }, i) => {
      temp.reset(0, 1)
      temp.rotate(angle as number)

      c.beginPath()
      c.moveTo(x + (temp.x * this.size) / 2, y + (temp.y * this.size) / 2)
      c.lineTo(x - (temp.x * this.size) / 2, y - (temp.y * this.size) / 2)
      c.lineTo(x + temp.y * RIB_WEIGHT, y - temp.x * RIB_WEIGHT)
      c.fill()
    })

    c.restore()
  }
}

export default Stroke
