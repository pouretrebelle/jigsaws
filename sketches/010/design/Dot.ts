import Vector2 from 'utils/Vector2'
import { map } from 'utils/numberUtils'

interface DotConstructor {
  i: number
  x: number
  y: number
  color: string
  curveRandom: number
}

const temp = new Vector2()

class Dot {
  i: number
  color: string
  pos: Vector2
  initialPos: Vector2
  vel: Vector2
  curve: number
  frame: number = 0

  constructor({ i, x, y, color, curveRandom }: DotConstructor) {
    this.i = i
    this.color = color

    this.pos = new Vector2(x, y)
    this.vel = new Vector2(1, 0)
    this.curve = map(curveRandom, -1, 1, -0.2, 0.2)
    this.initialPos = this.pos.clone()
  }

  update(angle: number) {
    this.vel.reset(1, 0).rotate(angle + this.curve)
    this.pos.plusEq(this.vel)
    this.frame++
  }

  draw(c: CanvasRenderingContext2D) {
    c.save()
  
    c.fillStyle = this.color
    c.strokeStyle = this.color

    c.beginPath()

    this.pos.copyTo(temp)
    temp.minusEq(this.vel)
    c.moveTo(temp.x, temp.y)

    temp.plusEq(this.vel).plusEq(this.vel)
    c.lineTo(temp.x, temp.y)

    c.stroke()
    c.restore()
  }
}

export default Dot
