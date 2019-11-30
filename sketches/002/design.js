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
  constructor({ x, y, colorRandom, directionRandom, rotationRandom }) {
    const hue =
      (prettyHues[Math.floor(colorRandom * (prettyHues.length - 1))] - 20) % 360
    const sat = 100
    const bri = 70
    this.color = hsl(hue, sat, bri)
    this.shadow = hsl((hue + 40) % 360, sat, bri)

    this.size = 25
    this.pos = new Vector2(x, y)
    this.vel = new Vector2(3)
    this.ang = directionRandom * 360
    this.rot = 0.02 + 0.02 * rotationRandom
    this.dir = Math.round(randomFromNoise(rotationRandom))

    this.vel.rotate(this.ang)
  }

  update(directionRandom) {
    // randomly change clockwiseness
    if (directionRandom > 0.98) {
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
  c.fillStyle = hsl(prettyHues[0], 100, 70)
  c.fillRect(0, 0, width, height)

  const simplex1 = new SimplexNoise(seed[0])
  const simplex2 = new SimplexNoise(seed[1])
  const simplex3 = new SimplexNoise(seed[2])
  const simplex4 = new SimplexNoise(seed[3])

  let dots = []
  const dotCount = 40
  const preDraw = 120

  for (let i = 0; i < dotCount; i++) {
    const x = width / 2
    const y = height / 2

    const colorRandom = randomFromNoise(simplex1.noise2D(30, i * 10))
    const directionRandom = randomFromNoise(simplex2.noise2D(10, i * 10))
    const rotationRandom = randomFromNoise(simplex3.noise2D(10, i * 10))

    const dot = new Dot({ x, y, colorRandom, directionRandom, rotationRandom })

    dots.push(dot)
  }

  for (let t = 0; t < preDraw; t++) {
    dots.forEach((dot, i) => {
      dot.draw(c)
      dot.update(randomFromNoise(simplex4.noise2D(10 * t, i * 10)))
    })
  }
}

export default design
