import Vector2 from 'utils/Vector2'
import { map } from 'utils/numberUtils'
import {
  AVOIDANCE_THRESHOLD,
  COLOR_SCALE,
  DISTANCE_PER_FRAME,
  LENGTH_VARIATION,
  MAX_LENGTH,
  MIN_LENGTH,
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
  initialAngle: number

  constructor({ i, pos }: StrokeConstructor) {
    this.i = i
    this.thickness = THICKNESS
    this.active = true
    this.initialAngle = 0

    this.pos = pos
    this.points = [{ x: pos.x, y: pos.y }]
    this.vel = new Vector2()
  }

  update(angle: number) {
    if (this.length === 0) {
      this.initialAngle = angle
    }

    this.vel.reset(DISTANCE_PER_FRAME, 0).rotate(angle)
    this.pos.plusEq(this.vel)

    this.points.push({
      x: this.pos.x,
      y: this.pos.y,
    })

    if (this.length > MIN_LENGTH) this.thickness += THICKENSS_INCREMENT

    this.length += DISTANCE_PER_FRAME
  }

  canDraw(strokes: Stroke[]) {
    if (!this.active) return false

    // should loop over all of this.points as well to see if the increased thickness hits any other strokes?
    const tooClose = strokes.some((stroke) => {
      if (stroke.i === this.i) return false

      return stroke.points.some((point) => {
        this.pos.copyTo(temp)
        temp.x -= point.x
        temp.y -= point.y
        return (
          temp.magnitude() <
          AVOIDANCE_THRESHOLD + (this.thickness + stroke.thickness) / 2
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
    if (this.length > MAX_LENGTH - LENGTH_VARIATION) return

    const lengthLerp = map(
      this.length,
      MIN_LENGTH,
      MAX_LENGTH - LENGTH_VARIATION,
      0,
      1
    )
    let color = COLOR_SCALE(lengthLerp).hex()

    c.strokeStyle = color
    c.lineWidth = this.thickness
    c.lineCap = 'round'

    c.beginPath()
    this.points.forEach(({ x, y }, i) => {
      if (i === 0) return c.moveTo(x, y)
      c.lineTo(x, y)
    })
    c.stroke()
  }
}

export default Stroke
