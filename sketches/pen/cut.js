// import SimplexNoise from 'simplex-noise'
// import Vector2 from '../../utils/Vector2'

const drawPatternLines = ({ c, width, height, spacing }) => {
  const minSize = Math.min(width, height)
  const lGap = spacing * Math.sqrt(2)

  const toRight = Array.from({ length: Math.ceil(width / lGap) }, (x, i) => ({
    x: i * lGap,
    l: Math.min(height, width - i * lGap),
  }))
  const toLeft = Array.from({ length: Math.ceil(height / lGap) }, (x, i) => ({
    y: i * lGap,
    l: Math.min(width, height - i * lGap),
  }))

  const drawDiag = (x, y, l) => {
    c.moveTo(x, y)
    c.lineTo(x + l, y + l)
  }

  c.beginPath()
  drawDiag(0, 0, minSize)
  toRight.forEach(({ x, l }) => drawDiag(x, 0, l))
  toLeft.forEach(({ y, l }) => drawDiag(0, y, l))
  c.stroke()
}

const drawPattern = {
  lines: drawPatternLines,
}

const fillPattern = (pattern, { c, x, y, width, height, ...patternProps }) => {
  c.save()
  c.translate(x, y)
  drawPattern[pattern]({ c, width, height, ...patternProps })
  c.restore()
}

const cut = ({ c, width, height, seed }) => {
  // const simplex1 = new SimplexNoise(seed[0])
  // const simplex2 = new SimplexNoise(seed[1])
  // const simplex3 = new SimplexNoise(seed[2])
  // const simplex4 = new SimplexNoise(seed[3])

  fillPattern('lines', { c, width, height, spacing: 5 })
}

export default cut
