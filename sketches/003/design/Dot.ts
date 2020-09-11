import Vector2 from 'utils/Vector2'

import { map } from 'utils/numberUtils'
import { FOREGROUND } from './constants'

const DOT_MIN_SIZE = 10
const DOT_MAX_SIZE = 30
const DOT_SHADOW_LAG = 5

interface DotConstructor {
  y: number
  color: string
  flip: boolean
  sizeRandom: number
  rotationRandom: number
  curveRandom: number
}

class Dot {
  startY: number
  color: string
  shadow: string
  size: number
  pos: Vector2
  vel: Vector2
  ang: number
  rot: number
  dir: boolean
  curveOffset: number

  constructor({
    y,
    color,
    flip,
    sizeRandom,
    rotationRandom,
    curveRandom,
  }: DotConstructor) {
    this.startY = y

    if (flip) {
      this.color = FOREGROUND
      this.shadow = color
    } else {
      this.color = color
      this.shadow = FOREGROUND
    }

    this.size = map(sizeRandom, -1, 1, DOT_MIN_SIZE, DOT_MAX_SIZE)
    this.pos = new Vector2(-this.size, y)
    this.vel = new Vector2(3)
    this.ang = rotationRandom * 0.3 * (flip ? -1 : 1)
    this.rot = 0.05 + 0.03 * rotationRandom
    this.dir = flip
    this.curveOffset = 2 + curveRandom * 3

    this.vel.rotate(this.ang)
  }

  update() {
    // flip the angle when it goes past the startY
    if (this.pos.y - this.startY > this.curveOffset) this.dir = false
    if (this.pos.y - this.startY < -this.curveOffset) this.dir = true

    // rotate
    if (this.dir) {
      this.vel.rotate(this.rot)
    } else {
      this.vel.rotate(-this.rot)
    }

    // add velocity to position
    this.pos.plusEq(this.vel)
  }

  draw(c: CanvasRenderingContext2D) {
    c.save()

    // draw shadow dot
    c.fillStyle = this.shadow
    c.beginPath()
    c.arc(
      this.pos.x,
      this.pos.y + DOT_SHADOW_LAG,
      this.size,
      0,
      Math.PI * 2,
      true
    )
    c.fill()

    // draw upper dot
    c.fillStyle = this.color
    c.beginPath()
    c.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2, true)
    c.fill()

    c.restore()
  }
}

export default Dot
