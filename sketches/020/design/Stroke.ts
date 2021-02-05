import Vector2 from 'utils/Vector2'

import {
  DISTANCE_BETWEEN_RIBS,
  RIB_WEIGHT,
  SPINE_WEIGHT,
  RIB_WIDTH,
} from './constants'

interface StrokeConstructor {
  i: number
  pos: Vector2
  color: string
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
  pos: Vector2
  points: Point[]
  vel: Vector2
  length: number = 0
  initialAngle: number

  constructor({ i, pos, color }: StrokeConstructor) {
    this.i = i
    this.color = color
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

    c.strokeStyle = this.color
    c.lineWidth = RIB_WEIGHT
    c.lineCap = 'round'

    this.points.forEach(({ x, y, angle }, i) => {
      temp.reset(0, RIB_WIDTH / 2)
      temp.rotate(angle ?? this.points[1].angle as number)

      c.beginPath()
      c.moveTo(x + temp.x, y + temp.y)
      c.lineTo(x - temp.x, y - temp.y)
      c.stroke()
    })

    c.lineWidth = SPINE_WEIGHT
    c.beginPath()
    c.moveTo(this.points[0].x, this.points[0].y)
    this.points.forEach(({
      x, y,
    }) => c.lineTo(x, y))
    c.stroke()

    c.restore()
  }
}

export default Stroke
