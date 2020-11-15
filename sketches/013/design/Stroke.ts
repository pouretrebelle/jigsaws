import Vector2 from 'utils/Vector2'
import { map } from 'utils/numberUtils'
import {
  AVOIDANCE_THRESHOLD,
  COLOR_SCALE,
  DISTANCE_PER_FRAME,
  THICKENSS_INCREMENT,
  THICKNESS,
} from './constants'

interface StrokeConstructor {
  i: number
  pos: Vector2
}

interface Point {
  x: number
  y: number
  size: number
}

const temp = new Vector2()

class Stroke {
  i: number
  thickness: number
  pos: Vector2
  points: Point[]
  vel: Vector2
  length: number = 0
  active: boolean
  color: string

  constructor({ i, pos }: StrokeConstructor) {
    this.i = i
    this.thickness = THICKNESS
    this.active = true
    this.color = '#000'

    this.pos = pos
    this.points = [{ x: pos.x, y: pos.y, size: this.thickness }]
    this.vel = new Vector2()
  }

  update(angle: number) {
    if (this.length === 0) {
      this.color = COLOR_SCALE(map(angle, 0, Math.PI*2, 0, 1, true)).hex()
    }

    this.vel.reset(DISTANCE_PER_FRAME, 0).rotate(angle)
    this.pos.plusEq(this.vel)

    this.points.push({
      x: this.pos.x,
      y: this.pos.y,
      size: this.thickness,
    })

    this.thickness += THICKENSS_INCREMENT

    this.length++
  }

  canDraw(strokes: Stroke[]) {
    if (!this.active) return false

    const tooClose = strokes.some((stroke) => {
      if (stroke.i === this.i) return false

      return stroke.points.some((point) => {
        this.pos.copyTo(temp)
        temp.x -= point.x
        temp.y -= point.y
        return (
          temp.magnitude() <
          AVOIDANCE_THRESHOLD + (this.thickness + point.size) / 2
        )
      })
    })

    if (tooClose) {
      this.active = false
      return false
    }

    return true
  }

  draw(c: CanvasRenderingContext2D) {
    c.save()

    c.strokeStyle = this.color
    c.lineWidth = this.thickness

    this.points.forEach(({ x, y, size }, i) => {
      if (i === 0) return
      c.beginPath()
      c.lineWidth = size
      c.moveTo(this.points[i - 1].x, this.points[i - 1].y)
      c.lineTo(x, y)
      c.stroke()
    })

    c.restore()
  }

  shortestDistToPos(pos: Vector2) {
    return this.points.reduce((curr, point) => {
      pos.copyTo(temp)
      temp.x -= point.x
      temp.y -= point.y
      return Math.min(temp.magnitude() - point.size / 2, curr)
    }, Infinity)
  }
}

export default Stroke
