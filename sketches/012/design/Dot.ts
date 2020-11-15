import Vector2 from 'utils/Vector2'

interface DotConstructor {
  pos: Vector2
  radius: number
  color: string
}

class Dot {
  pos: Vector2
  radius: number
  color: string

  constructor({ pos, radius, color }: DotConstructor) {
    this.pos = pos
    this.radius = radius
    this.color = color
  }

  draw(c: CanvasRenderingContext2D) {
    c.save()

    c.fillStyle = this.color
    c.beginPath()
    c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
    c.fill()

    c.restore()
  }
}

export default Dot
