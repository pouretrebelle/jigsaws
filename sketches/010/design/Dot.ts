import Vector2 from 'utils/Vector2'
import { map } from 'utils/numberUtils'
import { AVOIDANCE_THRESHOLD, DISTANCE_PER_FRAME } from './constants'

interface DotConstructor {
  i: number
  x: number
  y: number
  color: string
  curveRandom: number
}

interface PrevPos {
  x: number
  y: number
}

const temp = new Vector2()

class Dot {
  i: number
  color: string
  pos: Vector2
  prevPos: PrevPos[]
  vel: Vector2
  curve: number
  frame: number = 0
  active: boolean

  constructor({ i, x, y, color, curveRandom }: DotConstructor) {
    this.i = i
    this.color = color
    this.active = true

    this.pos = new Vector2(x, y)
    this.prevPos = []
    this.vel = new Vector2()
    this.curve = map(curveRandom, -1, 1, -0.2, 0.2)
  }

  update(angle: number) {
    this.vel.reset(DISTANCE_PER_FRAME, 0).rotate(angle + this.curve)
    this.pos.plusEq(this.vel)

    this.prevPos.push({ x: this.pos.x, y: this.pos.y })

    this.frame++
  }

  canDraw(dots: Dot[]) {
    if (!this.active) return false

    const tooClose = dots.some((dot) => {
      if (dot.i === this.i) return false

      return dot.prevPos.some((pos) => {
        this.pos.copyTo(temp)
        temp.x -= pos.x
        temp.y -= pos.y
        return temp.magnitude() < AVOIDANCE_THRESHOLD
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

    c.fillStyle = this.color
    c.strokeStyle = this.color

    c.beginPath()

    this.pos.copyTo(temp)
    temp.minusEq(this.vel)
    c.moveTo(temp.x, temp.y)

    temp.plusEq(this.vel).plusEq(this.vel)
    c.lineTo(temp.x, temp.y)

    c.stroke()
    c.restore()
  }
}

export default Dot
