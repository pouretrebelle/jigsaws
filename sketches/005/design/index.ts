import { Design } from 'types'
import { map } from 'utils/numberUtils'
import { hsl } from 'utils/colorUtils'

export enum Seeds {
  Noise,
}

const NOISE_LAYERS = [
  {
    resolution: 0.05,
    intensity: 0.8,
  },
  {
    resolution: 0.2,
    intensity: 0.2,
  },
]

export const design = ({
  c,
  simplex,
  seed,
  width,
  height,
  rows,
  columns,
  bleed,
}: Design) => {
  c.save()
  c.translate(bleed, bleed)
  const squareWidth = (width - bleed * 2) / columns
  const squareHeight = (height - bleed * 2) / rows

  const intensities = []
  const squares = [] as number[][]

  for (let x = 0; x < columns; x++) {
    if (!squares[x]) squares.push([])
    for (let y = 0; y < rows; y++) {
      let intensity = NOISE_LAYERS.reduce(
        (prev, curr, i) =>
          prev +
          simplex[Seeds.Noise].noise2D(
            i + x * curr.resolution,
            i + y * curr.resolution
          ) *
            curr.intensity,
        0
      )

      if (x === 0 || x === columns - 1 || y === 0 || y === rows - 1)
        intensity -= 1

      intensities.push(intensity)
      squares[x][y] = intensity

      c.fillStyle = hsl(40, 100, map(intensity, -1, 1, 0, 100, true))
      c.fillRect(squareWidth * x, squareHeight * y, squareWidth, squareHeight)
    }
  }

  const min = Math.min(...intensities)
  const max = Math.max(...intensities)

  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      squares[x][y] = map(squares[x][y], min, max, 0, 1)
    }
  }

  console.log(squares)

  c.restore()
}
