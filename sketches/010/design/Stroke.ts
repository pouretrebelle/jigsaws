import Vector2 from 'utils/Vector2'
import { map } from 'utils/numberUtils'
import {
  AVOIDANCE_THRESHOLD,
  COLOR_SCALE,
  DISTANCE_PER_FRAME,
  FRAMES,
  THICKENSS_INCREMENT,
  THICKNESS,
} from './constants'

interface StroketConstructor {
  i: number
  x: number
  y: number
  curveRandom: number
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
  curve: number
  length: number = 0
  active: boolean

  constructor({ i, x, y, curveRandom }: StroketConstructor) {
    this.i = i
    this.thickness = THICKNESS
    this.active = true

    this.pos = new Vector2(x, y)
    this.points = [{ x, y, size: this.thickness }]
    this.vel = new Vector2()
    this.curve = map(curveRandom, -1, 1, -0.2, 0.2)
  }

  update(angle: number) {
    this.vel.reset(DISTANCE_PER_FRAME, 0).rotate(angle + this.curve)
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

    const color = COLOR_SCALE(map(this.length, 0, FRAMES, 1.5, 0)).hex()
    c.strokeStyle = color
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
}

export default Stroke
