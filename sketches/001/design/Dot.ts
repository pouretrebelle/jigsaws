import Vector2 from 'utils/Vector2'

import { PRETTY_HUES } from './constants'
import { randomFromNoise, map } from 'utils/numberUtils'
import { hsl } from 'utils/colorUtils'

const DOT_MIN_SIZE = 15
const DOT_MAX_SIZE = 50
const DOT_SHADOW_LAG = 5

interface DotConstructor {
  x: number
  y: number
  colorRandom: number
  shadowRandom: number
  sizeRandom: number
  velocityRandom: number
  directionRandom: number
  rotationRandom: number
}

class Dot {
  color: string
  shadow: string
  size: number
  pos: Vector2
  vel: Vector2
  ang: number
  rot: number
  dir: number

  constructor({
    x,
    y,
    colorRandom,
    shadowRandom,
    sizeRandom,
    velocityRandom,
    directionRandom,
    rotationRandom,
  }: DotConstructor) {
    const hueNumber = Math.floor(colorRandom * PRETTY_HUES.length)
    const hue = PRETTY_HUES[hueNumber]
    const hueNumber2 = Math.floor(shadowRandom * PRETTY_HUES.length)
    const hue2 = PRETTY_HUES[hueNumber2]
    const sat = 100
    const bri = 70
    this.color = hsl(hue, sat, bri)
    this.shadow = hsl(hue2, sat, bri)

    this.size = map(sizeRandom, 0, 1, DOT_MIN_SIZE, DOT_MAX_SIZE)
    this.pos = new Vector2(x, y)
    this.vel = new Vector2(1 + Math.floor(velocityRandom * 2))
    this.ang = directionRandom * 360
    this.rot = 0.02 + 0.02 * rotationRandom
    this.dir = Math.round(randomFromNoise(rotationRandom))

    this.vel.rotate(this.ang)
  }

  update(directionRandom: number) {
    // randomly change clockwiseness
    if (directionRandom > 0.99) {
      this.dir = this.dir === 1 ? 0 : 1
    }

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
