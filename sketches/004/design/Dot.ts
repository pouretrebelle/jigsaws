import Vector2 from 'utils/Vector2'

import { map } from 'utils/numberUtils'
import { FOREGROUND, COLORS } from './constants'

const DOT_MIN_SIZE = 10
const DOT_MAX_SIZE = 20
const DOT_SHADOW_LAG = 3

interface DotConstructor {
  x: number
  y: number
  color: string
  flip: boolean
  sizeRandom: number
  rotationRandom: number
}

class Dot {
  color: string
  shadow: string
  size: number
  pos: Vector2
  vel: Vector2
  rot: number
  dir: boolean
  flip: boolean

  constructor({
    x,
    y,
    flip,
    color,
    sizeRandom,
    rotationRandom,
  }: DotConstructor) {
    this.color = color
    this.shadow = flip ? FOREGROUND[1] : FOREGROUND[0]
    this.size =
      map(sizeRandom, 0, 1, DOT_MIN_SIZE, DOT_MAX_SIZE) * (flip ? 1 : 0.8)
    this.pos = new Vector2(x, y)
    this.vel = new Vector2(2)
    this.rot = 0.04 + 0.01 * rotationRandom
    this.flip = flip
    this.dir = !flip

    this.vel.rotate(flip ? 0 : Math.PI)
  }

  update() {
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
      this.pos.y + DOT_SHADOW_LAG * (this.flip ? -1 : 1),
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
