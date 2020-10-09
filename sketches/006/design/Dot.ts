import Vector2 from 'utils/Vector2'
import { map, randomFromNoise } from 'utils/numberUtils'

const DOT_MIN_SIZE = 15
const DOT_MAX_SIZE = 30
const DOT_SHADOW_LAG = 1.5
const DOT_LAG = 3
const MIN_FRAMES = 150
const MIN_FRAMES_FOR_FLIP = 10
const MAX_FRAMES_FOR_FLIP = 50

interface DotConstructor {
  i: number
  x: number
  y: number
  color: string
  shadow: string
  sizeRandom: number
  curveRandom: number
  startAngleRandom: number
  changeDirFunc: (frame: number) => number
}

class Dot {
  i: number
  color: string
  shadow: string
  size: number
  pos: Vector2
  initialPos: Vector2
  vel: Vector2
  ang: number
  rot: number
  dir: boolean
  changeDirFunc: (frame: number) => number
  frame: number = 0
  lastFlippedAtFrame: number = 0

  constructor({
    i,
    x,
    y,
    color,
    shadow,
    sizeRandom,
    curveRandom,
    startAngleRandom,
    changeDirFunc,
  }: DotConstructor) {
    this.i = i
    this.color = color
    this.shadow = shadow

    this.size = map(sizeRandom, -1, 1, DOT_MIN_SIZE, DOT_MAX_SIZE)
    this.pos = new Vector2(x, y)
    this.initialPos = this.pos.clone()
    this.vel = new Vector2(DOT_LAG)
    this.ang = map(randomFromNoise(startAngleRandom), 0, 1, 0, Math.PI * 2)
    this.rot = 0.02 + 0.02 * curveRandom
    this.dir = changeDirFunc(0) > 0 ? true : false
    this.changeDirFunc = changeDirFunc

    this.vel.rotate(this.ang)
  }

  shouldDraw(designWidth: number, designHeight: number) {
    if (this.frame < MIN_FRAMES) return true

    if (
      this.pos.x < -this.size ||
      this.pos.x > designWidth + this.size ||
      this.pos.y < -this.size ||
      this.pos.y > designHeight + this.size
    )
      return false

    return true
  }

  update() {
    if (
      (this.frame - this.lastFlippedAtFrame > MIN_FRAMES_FOR_FLIP &&
        randomFromNoise(this.changeDirFunc(this.frame * 0.1)) > 0.98) ||
      this.frame - this.lastFlippedAtFrame > MAX_FRAMES_FOR_FLIP
    ) {
      this.dir = !this.dir
      this.lastFlippedAtFrame = this.frame
    }

    // rotate
    if (this.dir) {
      this.vel.rotate(this.rot)
    } else {
      this.vel.rotate(-this.rot)
    }

    // add velocity to position
    this.pos.plusEq(this.vel)
    this.frame++
  }

  draw(c: CanvasRenderingContext2D) {
    c.save()

    const shadowPos = this.initialPos
      .minusNew(this.pos)
      .normalise()
      .multiplyEq(DOT_SHADOW_LAG)
      .plusEq(this.pos)

    // draw shadow dot
    c.fillStyle = this.shadow
    this.drawDot(c, shadowPos)

    // draw upper dot
    c.fillStyle = this.color
    this.drawDot(c, this.pos)

    c.restore()
  }

  drawDot(c: CanvasRenderingContext2D, pos: Vector2) {
    c.beginPath()
    c.moveTo(pos.x, pos.y + this.size)
    c.lineTo(
      pos.x + Math.sin((Math.PI * 2) / 3) * this.size,
      pos.y + Math.cos((Math.PI * 2) / 3) * this.size
    )
    c.lineTo(
      pos.x - Math.sin((Math.PI * 2) / 3) * this.size,
      pos.y + Math.cos((Math.PI * 2) / 3) * this.size
    )
    c.fill()
  }
}

export default Dot
