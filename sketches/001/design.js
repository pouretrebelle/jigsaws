import SimplexNoise from 'simplex-noise'

const design = ({ c, seed, width, bleed }) => {
  const simplex1 = new SimplexNoise(seed[0])
  const simplex2 = new SimplexNoise(seed[1])
  const simplex3 = new SimplexNoise(seed[2])

  // background
  const fill = c.createLinearGradient(0, 0, width, width)
  fill.addColorStop(0, `hsl(${180 + simplex1.noise2D(0, 5) * 180}, 100%, 50%)`)
  fill.addColorStop(1, `hsl(${180 + simplex1.noise2D(0, 5.5) * 180}, 100%, 50%)`)
  c.fillStyle = fill
  c.fillRect(0, 0, width, width)

  // stripes
  const stripe = c.createLinearGradient(0, 0, 1, width)
  stripe.addColorStop(
    0,
    `hsl(${180 + simplex2.noise2D(0, 10) * 180}, 100%, 50%)`
  )
  stripe.addColorStop(
    1,
    `hsl(${180 + simplex2.noise2D(0, 10.5) * 180}, 100%, 50%)`
  )

  const stripe2 = c.createLinearGradient(0, 0, width, 1)
  stripe2.addColorStop(
    0,
    `hsl(${180 + simplex3.noise2D(0, 15) * 180}, 100%, 50%)`
  )
  stripe2.addColorStop(
    1,
    `hsl(${180 + simplex3.noise2D(0, 15.5) * 180}, 100%, 50%)`
  )

  let strips = Math.round(40 + simplex1.noise2D(0, 20) * 30)
  if (strips % 2 === 0) strips++
  const stripWidth = (width - bleed * 2) / strips

  for (
    let x = bleed + stripWidth;
    x < width - bleed - stripWidth;
    x += stripWidth * 2
  ) {
    c.fillStyle = stripe
    c.fillRect(x, 0, stripWidth, width)
    c.fillStyle = stripe2
    c.fillRect(0, x, width, stripWidth)
  }
}

export default design
