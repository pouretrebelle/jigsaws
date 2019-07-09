import SimplexNoise from 'simplex-noise'

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

class Point {
  constructor(x, y, rows, simplexX, simplexY, width) {
    this.x = tweakDist(x, y, rows, simplexX) * width
    this.y = tweakDist(y, x, rows, simplexY) * width
  }
}

const cut = ({ c, width, rows, seed }) => {
  const simplex1 = new SimplexNoise(seed[0])
  const simplex2 = new SimplexNoise(seed[1])
  const crossPoints = []

  for (let x = 0; x < rows + 1; x++) {
    if (!crossPoints[x]) crossPoints.push([])
    for (let y = 0; y < rows + 1; y++) {
      crossPoints[x][y] = new Point(x, y, rows, simplex1, simplex2, width)
    }
  }

  crossPoints.forEach((row) =>
    row.forEach((point) => {
      c.beginPath()
      c.arc(point.x, point.y, 0.005 * width, 0, 2 * Math.PI)
      c.fill()
      c.closePath()
    })
  )

  c.beginPath()
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < rows; y++) {
      c.moveTo(crossPoints[x + 1][y].x, crossPoints[x + 1][y].y)
      c.lineTo(crossPoints[x + 1][y + 1].x, crossPoints[x + 1][y + 1].y)
      c.lineTo(crossPoints[x][y + 1].x, crossPoints[x][y + 1].y)
    }
  }
  c.stroke()
}

export default cut
