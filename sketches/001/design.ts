import SimplexNoise from 'simplex-noise'

interface Args {
  c: CanvasRenderingContext2D
  seed: string[]
  width: number
  height: number
  bleed: number
  rows: number
  columns: number
}

const design = ({
  c,
  seed,
  width,
  height,
  bleed,
  rows,
  columns,
}: Args): void => {
  const simplex1 = new SimplexNoise(seed[0])

  c.fillStyle = '#000'
  c.fillRect(0, 0, width, height)

  // background
  const fill = c.createLinearGradient(0, 0, width, height)
  fill.addColorStop(0, `hsl(${180 + simplex1.noise2D(0, 5) * 180}, 100%, 50%)`)
  fill.addColorStop(
    1,
    `hsl(${180 + simplex1.noise2D(0, 5.5) * 180}, 100%, 50%)`
  )
  c.fillStyle = fill
  c.fillRect(bleed, bleed, width - bleed * 2, height - bleed * 2)

  // strips
  c.fillStyle = '#000'

  let verticalStrips = columns * 2 + 1
  const stripWidth = (width - bleed * 2) / verticalStrips
  for (let x = bleed; x < width - bleed; x += stripWidth * 2) {
    c.fillRect(x, 0, stripWidth, height)
  }

  let horizontalStrips = rows * 2 + 1
  const stripHeight = (height - bleed * 2) / horizontalStrips
  for (let y = bleed; y < height - bleed; y += stripHeight * 2) {
    c.fillRect(0, y, width, stripHeight)
  }
}

export default design
