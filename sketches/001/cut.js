import SimplexNoise from 'simplex-noise'
import Vector2 from './Vector2'

const tweakDist = (m, alt, rows, simplex) => {
  const edgeAvoidanceScalar =
    1 - Math.pow(Math.abs((m - rows / 2) / (rows / 2)), 5)
  return (
    (m +
      (simplex.noise2D(m * 0.15, alt * 0.15) * 0.2 +
        simplex.noise2D(m * 0.4, alt * 0.4) * 0.1) *
        edgeAvoidanceScalar) /
    rows
  )
}

class Point extends Vector2 {
  constructor({ x, y, rows, columns, simplexX, simplexY, width, height }) {
    super()
    this.x = tweakDist(x, y, columns, simplexX) * width
    this.y = tweakDist(y, x, rows, simplexY) * height
  }
}

const drawCurves = (c, p1, p2, flip) => {
  const tVmult = 0.25 // push of t towards other side of piece
  const tVdiv = 0.4 // push of p1c and p2c away from other side of piece
  const tWidth = 0.7 // how far t1 and t2 are from the canter
  const pWidth = 0.8 // how far p1x and p2c are from the center

  const midPoint = p1.plusNew(p2).multiplyEq(0.5)
  const pV = p2.minusNew(p1) // vector from p1 to p2
  const tV = pV.multiplyNew(tVmult).rotate(flip ? 90 : -90, true) // perpendicular to pV
  const t = midPoint.plusNew(tV) // top point of divet

  const p1c = p1.plusNew(pV.multiplyNew(pWidth)).minusEq(tV.multiplyNew(tVdiv))
  const t1 = t.minusNew(pV.multiplyNew(tWidth / 2))
  const t2 = t.plusNew(pV.multiplyNew(tWidth / 2))
  const p2c = p2.minusNew(pV.multiplyNew(pWidth)).minusEq(tV.multiplyNew(tVdiv))

  c.beginPath()
  c.moveTo(p1.x, p1.y)
  c.bezierCurveTo(p1c.x, p1c.y, t1.x, t1.y, t.x, t.y)
  c.bezierCurveTo(t2.x, t2.y, p2c.x, p2c.y, p2.x, p2.y)
  c.stroke()
}

const cut = ({ c, width, columns, height, rows, seed }) => {
  const simplex1 = new SimplexNoise(seed[0])
  const simplex2 = new SimplexNoise(seed[1])
  const simplex3 = new SimplexNoise(seed[2])
  const simplex4 = new SimplexNoise(seed[3])
  const crossPoints = []

  for (let x = 0; x < columns + 1; x++) {
    if (!crossPoints[x]) crossPoints.push([])
    for (let y = 0; y < rows + 1; y++) {
      crossPoints[x][y] = new Point({
        x,
        y,
        rows,
        columns,
        simplexX: simplex1,
        simplexY: simplex2,
        width,
        height,
      })
    }
  }

  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      const left = crossPoints[x][y + 1]
      const corner = crossPoints[x + 1][y + 1]
      const right = crossPoints[x + 1][y]

      if (x < columns - 1) {
        drawCurves(c, right, corner, simplex3.noise2D(x * 2, y * 2) < 0)
      }

      if (y < rows - 1) {
        drawCurves(c, left, corner, simplex4.noise2D(x * 2, y * 2) < 0)
      }
    }
  }
}

export default cut
