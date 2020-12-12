import { rgb } from 'chroma-js'

import Vector2 from 'utils/Vector2'
import { map } from 'utils/numberUtils'
import {
  AVOIDANCE_THRESHOLD,
  DISTANCE_PER_FRAME,
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
  initialAngle: number

  constructor({ i, pos }: StrokeConstructor) {
    this.i = i
    this.thickness = THICKNESS
    this.active = true
    this.initialAngle = 0

    this.pos = pos
    this.points = [{ x: pos.x, y: pos.y, size: this.thickness }]
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

    const angleLerp = map(this.initialAngle, 0, Math.PI * 2, 0, 1, true)
    const lengthLerp = map(this.length, MIN_LENGTH, MAX_LENGTH, 0, 1)

    let lastDrawn = 0
    this.points.forEach(({ x, y, size }, i) => {
      if (i === 0) return
      if (i - lastDrawn >= 3) {
        const pointLerp = map(i, 0, this.points.length - 1, 0, 1)

        const color = rgb(
          map(pointLerp, 0, 1, 240, 50) + map(angleLerp, 0, 1, 50, 0),
          map(angleLerp, 0, 1, 100, 150) + map(pointLerp, 0, 1, 80, -20),
          map(lengthLerp, 0, 1, 150, 255)
        ).saturate(1).hex()

        c.fillStyle = color

        lastDrawn = i
        c.beginPath()
        c.arc(x, y, size / 2, 0, 2 * Math.PI)
        c.fill()
      }
    })

    c.restore()
  }
}

export default Stroke
