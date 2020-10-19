import Vector2 from 'utils/Vector2'
import { map, randomFromNoise } from 'utils/numberUtils'

const DOT_MIN_SIZE = 15
const DOT_MAX_SIZE = 30
const DOT_LAG = 3
const MIN_FRAMES = 150
const MIN_FRAMES_FOR_FLIP = 10
const MAX_FRAMES_FOR_FLIP = 50

interface DotConstructor {
  i: number
  x: number
  y: number
  color: string
  sizeRandom: number
  curveRandom: number
  startAngleRandom: number
  changeDirFunc: (frame: number) => number
}

class Dot {
  i: number
  color: string
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
    sizeRandom,
    curveRandom,
    startAngleRandom,
    changeDirFunc,
  }: DotConstructor) {
    this.i = i
    this.color = color

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

  updateBackward() {
    // trying and failing to map the direction back to where we started
    // but it looks nice so going with it
    this.frame--
    if (
      (this.lastFlippedAtFrame - this.frame > MIN_FRAMES_FOR_FLIP &&
        randomFromNoise(this.changeDirFunc(this.frame * 0.1)) > 0.98) ||
      this.frame - this.lastFlippedAtFrame > MAX_FRAMES_FOR_FLIP
    ) {
      this.dir = !this.dir
      this.lastFlippedAtFrame = this.frame
    }

    // rotate
    if (this.dir) {
      this.vel.rotate(-this.rot)
    } else {
      this.vel.rotate(this.rot)
    }

    // add velocity to position
    this.pos.minusEq(this.vel)
  }

  draw(c: CanvasRenderingContext2D, backwards: boolean) {
    const normalDir = this.vel
      .clone()
      .normalise()
      .rotate(Math.PI / 2)
      .multiplyEq(backwards ? -this.size : this.size)
    const pos = this.pos.plusNew(normalDir)

    c.save()
    c.fillStyle = this.color

    c.beginPath()
    c.arc(pos.x, pos.y, this.size, 0, Math.PI * 2)
    c.fill()
    c.restore()
  }
}

export default Dot
