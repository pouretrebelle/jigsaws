import SimplexNoise from 'simplex-noise'

import Vector2 from '../../utils/Vector2'
import { clamp } from '../../utils/numberUtils'

const hsl = (h, s, l) => `hsl(${h}, ${clamp(s, 0, 100)}%, ${clamp(l, 0, 100)}%)`

const randomFromNoise = (noiseValue) => Math.abs(noiseValue * 1000) % 1

const prettyHues = [
  2,
  10,
  17,
  37,
  40,
  63,
  67,
  72,
  74,
  148,
  152,
  156,
  160,
  170,
  175,
  189,
  194,
  260,
  270,
  280,
  288,
  302,
  320,
  330,
  340,
  350,
]

class Dot {
  constructor({
    x,
    y,
    colorRandom,
    shadowRandom,
    sizeRandom,
    velocityRandom,
    directionRandom,
    rotationRandom,
  }) {
    const hueNumber = Math.floor(colorRandom * prettyHues.length)
    const hue = prettyHues[hueNumber]
    const hueNumber2 = Math.floor(shadowRandom * prettyHues.length)
    const hue2 = prettyHues[hueNumber2]
    const sat = 100
    const bri = 70
    this.color = hsl(hue, sat, bri)
    this.shadow = hsl(hue2, sat, bri)

    this.size = 15 + 15 * sizeRandom
    this.pos = new Vector2(x, y)
    this.vel = new Vector2(1 + Math.floor(velocityRandom * 2))
    this.ang = directionRandom * 360
    this.rot = 0.02 + 0.02 * rotationRandom
    this.dir = Math.round(randomFromNoise(rotationRandom))

    this.vel.rotate(this.ang)
  }

  update(directionRandom) {
    // randomly change clockwiseness
    if (directionRandom > 0.99) {
      this.dir = this.dir == 1 ? 0 : 1
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

  draw(c) {
    c.save()

    // draw shadow dot
    c.fillStyle = this.shadow
    c.beginPath()
    c.arc(this.pos.x, this.pos.y + 5, this.size, 0, Math.PI * 2, true)
    c.fill()

    // draw upper dot
    c.fillStyle = this.color
    c.beginPath()
    c.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2, true)
    c.fill()

    c.restore()
  }
}

const design = ({ c, seed, width, height }) => {
  c.fillStyle = hsl(prettyHues[16], 100, 70)
  c.fillRect(0, 0, width, height)

  const simplex1 = new SimplexNoise(seed[0])
  const simplex2 = new SimplexNoise(seed[1])
  const simplex3 = new SimplexNoise(seed[2])
  const simplex4 = new SimplexNoise(seed[3])

  const dotCount = 30
  const preDraw = 100

  for (let i = 0; i < dotCount; i++) {
    const x = (width * simplex1.noise2D(1.5, i)) / 2 + width / 2
    const y = (height * simplex1.noise2D(2.5, i)) / 2 + height / 2

    const colorRandom = randomFromNoise(simplex1.noise2D(3.5, i))
    const shadowRandom = randomFromNoise(simplex1.noise2D(4.5, 1.5 + i))
    const sizeRandom = randomFromNoise(simplex2.noise2D(1.5, i))
    const velocityRandom = randomFromNoise(simplex3.noise2D(1.5, i))
    const directionRandom = randomFromNoise(simplex4.noise2D(1.5, i))
    const rotationRandom = randomFromNoise(simplex4.noise2D(2.5, i))

    const dot = new Dot({
      x,
      y,
      colorRandom,
      shadowRandom,
      sizeRandom,
      velocityRandom,
      directionRandom,
      rotationRandom,
    })

    for (let t = 0; t < preDraw; t++) {
      dot.draw(c)
      dot.update(randomFromNoise(simplex4.noise2D(2.5 + t, i)))
    }
  }
}

export default design
