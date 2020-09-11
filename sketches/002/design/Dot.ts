import Vector2 from 'utils/Vector2'

import { PRETTY_HUES } from './constants'
import { map } from 'utils/numberUtils'
import { hsl } from 'utils/colorUtils'

const DOT_MIN_SIZE = 10
const DOT_MAX_SIZE = 40
const DOT_SHADOW_LAG = 5

interface DotConstructor {
  colorRandom: number
  shadowRandom: number
  sizeRandom: number
  directionRandom: number
  rotationRandom: number
  curveRandom: number
}

const getColor = (hue: number): string => {
  let sat = 100
  let bri = 70
  if (hue < 200 && hue > 40) {
    sat = 80
    bri = 60
  }
  if (hue <= 150) {
    sat = 85
  }
  return hsl(hue, sat, bri)
}

class Dot {
  color: string
  shadow: string
  size: number
  pos: Vector2
  vel: Vector2
  ang: number
  rot: number
  dir: boolean
  curve: number

  constructor({
    colorRandom,
    shadowRandom,
    sizeRandom,
    directionRandom,
    rotationRandom,
    curveRandom,
  }: DotConstructor) {
    const hueNumber = Math.floor(colorRandom * PRETTY_HUES.length)
    const hue = PRETTY_HUES[hueNumber]
    const hueNumber2 = Math.floor(shadowRandom * PRETTY_HUES.length)
    const hue2 = PRETTY_HUES[hueNumber2]
    this.color = getColor(hue)
    this.shadow = getColor(hue2)

    this.size = map(sizeRandom, -1, 1, DOT_MIN_SIZE, DOT_MAX_SIZE)
    this.pos = new Vector2(0, 0)
    this.vel = new Vector2(3)
    this.ang = directionRandom * Math.PI * 2
    this.rot = 0.02 + 0.04 * rotationRandom
    this.dir = false //!!Math.round(rotationRandom)
    this.curve = 0.5 + curveRandom

    this.vel.rotate(this.ang)
  }

  update() {
    // flip angle when it starts to curl around
    const angleDiff = this.vel.angle() - this.pos.angle()
    if (angleDiff < -this.curve) this.dir = !this.dir
    if (angleDiff > 0 && angleDiff < Math.PI * 2 - this.curve)
      this.dir = !this.dir

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
