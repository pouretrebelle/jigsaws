import Vector2 from 'utils/Vector2'
import { map, randomFromNoise } from 'utils/numberUtils'

const DOT_LAG = 0.5
const MIN_FRAMES_FOR_FLIP = 60
const MAX_FRAMES_FOR_FLIP = 300

interface DotConstructor {
  i: number
  x: number
  y: number
  color: string
  maxFrames: number
  curveRandom: number
  startAngleRandom: number
  sizeFunc: (frame: number) => number
  changeDirFunc: (frame: number) => number
}

class Dot {
  i: number
  color: string
  pos: Vector2
  maxFrames: number
  initialPos: Vector2
  vel: Vector2
  ang: number
  rot: number
  dir: boolean
  size: number
  sizeFunc: (frame: number) => number
  changeDirFunc: (frame: number) => number
  frame: number = 0
  lastFlippedAtFrame: number = 0

  constructor({
    i,
    x,
    y,
    color,
    maxFrames,
    curveRandom,
    startAngleRandom,
    sizeFunc,
    changeDirFunc,
  }: DotConstructor) {
    this.i = i
    this.color = color
    this.maxFrames = maxFrames

    this.pos = new Vector2(x, y)
    this.initialPos = this.pos.clone()
    this.vel = new Vector2(DOT_LAG)
    this.ang = map(randomFromNoise(startAngleRandom), 0, 1, 0, Math.PI * 2)
    this.rot = 0.008 + 0.008 * curveRandom
    this.dir = changeDirFunc(0) > 0 ? true : false
    this.size = sizeFunc(0)
    this.sizeFunc = sizeFunc
    this.changeDirFunc = changeDirFunc

    this.vel.rotate(this.ang)
  }

  shouldDraw() {
    if (this.frame < this.maxFrames) return true

    return false
  }

  update() {
    this.size = this.sizeFunc(this.frame)

    if (
      (this.frame - this.lastFlippedAtFrame > MIN_FRAMES_FOR_FLIP &&
        randomFromNoise(this.changeDirFunc(this.frame * 0.1)) > 0.997) ||
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
    c.fillStyle = this.color

    c.beginPath()
    c.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2)
    c.fill()
    c.restore()
  }
}

export default Dot
