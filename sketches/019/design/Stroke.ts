import Vector2 from 'utils/Vector2'

import {
  AVOIDANCE_THRESHOLD,
  DISTANCE_PER_FRAME,
  MIN_LENGTH,
  STROKE_THICKNESS_INCREMENT,
  STROKE_THICKNESS,
  LINE_WEIGHT,
  SPINE_WEIGHT,
} from './constants'

interface StrokeConstructor {
  i: number
  pos: Vector2
  color: string
}

interface Point {
  x: number
  y: number
  angle: number
}

const temp = new Vector2()

class Stroke {
  i: number
  STROKE_THICKNESS: number
  color: string
  pos: Vector2
  points: Point[]
  vel: Vector2
  length: number = 0
  initialAngle: number

  constructor({ i, pos, color }: StrokeConstructor) {
    this.i = i
    this.STROKE_THICKNESS = STROKE_THICKNESS
    this.color = color
    this.initialAngle = 0

    this.pos = pos
    this.points = [{ x: pos.x, y: pos.y, angle: this.initialAngle }]
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
      angle: this.vel.angle(),
    })

    if (this.length > MIN_LENGTH) this.STROKE_THICKNESS += STROKE_THICKNESS_INCREMENT

    this.length += DISTANCE_PER_FRAME
  }

  draw(c: CanvasRenderingContext2D, strokes: Stroke[]) {
    c.save()

    c.strokeStyle = this.color
    c.lineWidth = LINE_WEIGHT
    c.lineCap = 'round'

    this.points.slice(1, -1).forEach(({ x, y, angle }, i) => {
      let closestDifference = Infinity

      strokes.forEach((stroke) => {
        if (stroke.i === this.i) return

        stroke.points.forEach((point) => {
          temp.reset(x, y)
          temp.x -= point.x
          temp.y -= point.y

          closestDifference = Math.min(closestDifference, temp.magnitude())
        })
      })

      const strokeThickness = closestDifference / 2// - AVOIDANCE_THRESHOLD / 2

      temp.reset(0, strokeThickness)
      temp.rotate(angle)

      c.beginPath()
      c.moveTo(x + temp.x, y + temp.y)
      c.lineTo(x - temp.x, y - temp.y)
      c.stroke()

      // start cap
      if (i === 0) {
        temp.rotate(Math.PI / 2)
        temp.normalise()
        const angleDiff = angle - this.points[2].angle
        let nextPos = { x, y }
        for (let dist = 0; dist <= strokeThickness; dist += DISTANCE_PER_FRAME) {
          c.lineWidth = SPINE_WEIGHT
          c.beginPath()

          temp.rotate(angleDiff)
          nextPos = { x: nextPos.x + temp.x * DISTANCE_PER_FRAME, y: nextPos.y + temp.y * DISTANCE_PER_FRAME }
          c.moveTo(nextPos.x, nextPos.y)
          c.lineTo(nextPos.x + temp.x * DISTANCE_PER_FRAME, nextPos.y + temp.y * DISTANCE_PER_FRAME);
          c.stroke()

          c.lineWidth = LINE_WEIGHT
          const thisStrokeThickness = Math.sqrt(Math.pow(strokeThickness, 2) * (1 - Math.pow((dist / strokeThickness), 2)))
          c.beginPath()
          c.moveTo(nextPos.x + temp.y * thisStrokeThickness, nextPos.y - temp.x * thisStrokeThickness)
          c.lineTo(nextPos.x - temp.y * thisStrokeThickness, nextPos.y + temp.x * thisStrokeThickness)
          c.stroke()
        }
      }

      // end cap
      if (i === this.points.length - 3) {
        temp.rotate(-Math.PI / 2)
        temp.normalise()
        const angleDiff = angle - this.points[this.points.length - 3].angle
        let nextPos = { x, y }
        for (let dist = 0; dist <= strokeThickness; dist += DISTANCE_PER_FRAME) {
          c.lineWidth = SPINE_WEIGHT
          c.beginPath()

          temp.rotate(angleDiff)
          nextPos = { x: nextPos.x + temp.x * DISTANCE_PER_FRAME, y: nextPos.y + temp.y * DISTANCE_PER_FRAME }
          c.moveTo(nextPos.x, nextPos.y)
          c.lineTo(nextPos.x + temp.x * DISTANCE_PER_FRAME, nextPos.y + temp.y * DISTANCE_PER_FRAME);
          c.stroke()

          c.lineWidth = LINE_WEIGHT
          const thisStrokeThickness = Math.sqrt(Math.pow(strokeThickness, 2) * (1 - Math.pow((dist / strokeThickness), 2)))
          c.beginPath()
          c.moveTo(nextPos.x + temp.y * thisStrokeThickness, nextPos.y - temp.x * thisStrokeThickness)
          c.lineTo(nextPos.x - temp.y * thisStrokeThickness, nextPos.y + temp.x * thisStrokeThickness)
          c.stroke()
        }
      }
    })

    c.lineWidth = SPINE_WEIGHT
    c.beginPath()
    c.moveTo(this.points[0].x, this.points[0].y)
    this.points.slice(1).forEach(({
      x, y,
    }) => c.lineTo(x, y))
    c.stroke()

    c.restore()
  }
}

export default Stroke
