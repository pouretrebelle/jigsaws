import SimplexNoise from 'simplex-noise'

const design = ({ c, seed, width, height, bleed }) => {
  const simplex = new SimplexNoise(seed[0])

  c.fillStyle = 'hsl(0, 0%, 96%)'
  c.fillRect(0, 0, width, height)

  // Gradient foreground
  const fill = c.createLinearGradient(0, 0, width, height)
  fill.addColorStop(0, `hsl(${180 + simplex.noise2D(0, 5) * 180}, 100%, 50%)`)
  fill.addColorStop(1, `hsl(${180 + simplex.noise2D(0, 5.5) * 180}, 100%, 50%)`)

  // Fill rectangle
  c.fillStyle = fill
  c.fillRect(0, 0, width, height)

  // Stripe
  const stripe = c.createLinearGradient(0, 0, 1, height)
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
    c.fillRect(x, 0, stripWidth, height)
  }
}

export default design
