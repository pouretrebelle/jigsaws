import SimplexNoise from 'simplex-noise'

const drawPatternLines = ({ c, width, height, lGap }) => {
  const minSize = Math.min(width, height)
  // const lGap = spacing * Math.sqrt(2)

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
  const simplex1 = new SimplexNoise(seed[0])
  const simplex2 = new SimplexNoise(seed[1])
  const simplex3 = new SimplexNoise(seed[2])
  const simplex4 = new SimplexNoise(seed[3])

  const gap = 10
  for (let y = -gap; y < height - gap; y += (height + gap) / 10) {
    for (let x = -gap; x < width - gap; x += (width + gap) / 7) {
      const size =
        1 +
        (simplex1.noise2D(x, y) > 0 ? 0 : 1) +
        (simplex2.noise2D(x, y) > 0 ? 0 : 1) +
        (simplex3.noise2D(x, y) > 0 ? 0 : 1) +
        (simplex4.noise2D(x, y) > 0 ? 0 : 1)

      const sizeChart = {
        1: 1.5,
        2: 2,
        3: 4,
        4: 6,
        5: 10,
      }

      const lGap = sizeChart[size]

      fillPattern('lines', {
        c,
        x: x + gap,
        y: y + gap,
        width: width / 7 - gap,
        height: height / 10 - gap,
        lGap,
      })
    }
  }
}

export default cut
