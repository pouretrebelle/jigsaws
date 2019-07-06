import SimplexNoise from 'simplex-noise'

const design = ({ c, seed, width, bleed }) => {
  const simplex = new SimplexNoise(seed[0])

  c.fillStyle = 'hsl(0, 0%, 96%)'
  c.fillRect(0, 0, width, width)

  // Gradient foreground
  const fill = c.createLinearGradient(0, 0, width, width)
  fill.addColorStop(0, `hsl(${180 + simplex.noise2D(0, 5) * 180}, 100%, 50%)`)
  fill.addColorStop(1, `hsl(${180 + simplex.noise2D(0, 5.5) * 180}, 100%, 50%)`)

  // Fill rectangle
  c.fillStyle = fill
  c.fillRect(0, 0, width, width)

  // Stripe
  const stripe = c.createLinearGradient(0, 0, 1, width)
  stripe.addColorStop(
    0,
    `hsl(${180 + simplex.noise2D(0, 10) * 180}, 100%, 50%)`
  )
  stripe.addColorStop(
    1,
    `hsl(${180 + simplex.noise2D(0, 10.5) * 180}, 100%, 50%)`
  )

  c.fillStyle = stripe

  const strips = 21
  const stripWidth = (width - bleed * 2) / strips
  for (let x = bleed + stripWidth; x < width - bleed; x += stripWidth * 2) {
    c.fillRect(x, 0, stripWidth, width)
  }
}

export default design
