import SimplexNoise from 'simplex-noise'
import { Design } from 'types'
import { hsl, hsla } from 'utils/colorUtils'
import { map, randomFromNoise } from 'utils/numberUtils'

import { GRID_COLUMNS, GRID_ROWS, LINE_CAP_SIZE, LINE_COUNT, LINE_MAX_LENGTH, LINE_OPACITY, LINE_WEIGHT } from './constants'

export enum Seeds {
  Shape,
  Color,
  Lines,
}

interface Shape {
  c: CanvasRenderingContext2D
  x: number
  y: number
  w: number
  h: number
  simplex: SimplexNoise
  noiseStart: number
}

const shapes = {
  blank: {
    weight: 3,
    draw: () => { }
  },
  circle: {
    weight: 2,
    draw: ({ c, w, h }: Shape) => {
      c.beginPath()
      c.arc(0, 0, w / 2, 0, Math.PI * 2)
      c.fill()
    },
  },
  opposites: {
    weight: 1,
    draw: ({ c, x, y, w, h, simplex }: Shape) => {
      const rotate = Math.floor(randomFromNoise(simplex.noise2D(100 + x, 100 + y)) * 2)
      c.rotate(rotate * Math.PI / 2)
      c.beginPath()
      c.arc(0, 0, w / 2, 0, Math.PI / 2)
      c.lineTo(-w / 2, h / 2)
      c.arc(0, 0, w / 2, Math.PI, Math.PI * 1.5)
      c.lineTo(w / 2, -h / 2)
      c.fill()
    },
  },
  twocorners: {
    weight: 1,
    draw: ({ c, x, y, w, h, simplex }: Shape) => {
      const rotate = Math.floor(randomFromNoise(simplex.noise2D(100 + x, 100 + y)) * 4)
      c.rotate(rotate * Math.PI / 2)
      c.beginPath()
      c.arc(0, 0, w / 2, 0, Math.PI)
      c.lineTo(-w / 2, -h / 2)
      c.lineTo(w / 2, -h / 2)
      c.fill()
    },
  },
  onecorner: {
    weight: 1,
    draw: ({ c, x, y, w, h, simplex }: Shape) => {
      const rotate = Math.floor(randomFromNoise(simplex.noise2D(100 + x, 100 + y)) * 4)
      c.rotate(rotate * Math.PI / 2)
      c.beginPath()
      c.arc(0, 0, w / 2, 0, Math.PI * 1.5)
      c.lineTo(w / 2, -h / 2)
      c.fill()
    },
  },
  quatrefoil: {
    weight: 1,
    draw: ({ c, x, y, w, h, simplex }: Shape) => {
      c.beginPath()
      c.arc(0, h / 2, w / 2, 0, Math.PI)
      c.arc(-w / 2, 0, w / 2, Math.PI * 0.5, Math.PI * 1.5)
      c.arc(0, -h / 2, w / 2, Math.PI, Math.PI * 2)
      c.arc(w / 2, 0, w / 2, Math.PI * 1.5, Math.PI * 2.5)
      c.fill()
    },
  }
}
const shapeKeys = Object.keys(shapes)
const shapeTotalWeights = shapeKeys.reduce(
  (prev, curr) => (prev + shapes[curr as keyof typeof shapes].weight), 0
)

const drawShape = (args: Shape) => {
  const { c, x, y, w, h, simplex, noiseStart } = args

  const shapeRand = randomFromNoise(simplex.noise3D(0.555 + x * 0.1, 0.444 + y * 0.1, 0.333 + noiseStart * 0.05)) * shapeTotalWeights
  let shapeKey = shapeKeys[0] as keyof typeof shapes
  shapeKeys.reduce(
    (prev, curr) => {
      if (prev < shapeRand) shapeKey = curr as keyof typeof shapes
      return (prev + shapes[curr as keyof typeof shapes].weight)
    }, 0
  )

  c.save()
  c.translate(x + w / 2, y + h / 2)
  { shapes[shapeKey].draw(args) }
  c.restore()
}

export const design = ({ c, simplex, width, height, bleed, noiseStart }: Design) => {
  const hues: number[] = []
  for (let i = 0; i < 5; i++) {
    hues.push(Math.floor(randomFromNoise(simplex[Seeds.Color].noise2D(5.25 + i, 3.33)) * 360))
  }
  c.save()

  c.fillStyle = hsl(hues[0], 40, 40)
  c.fillRect(0, 0, width, height)

  const cellWidth = (width - bleed * 2) / GRID_COLUMNS
  const cellHeight = (height - bleed * 2) / GRID_ROWS

  c.globalCompositeOperation = 'multiply'
  for (let col = -0.5; col < GRID_COLUMNS + 0.5; col += 2) {
    for (let row = -0.5; row < GRID_ROWS + 0.5; row += 2) {
      const h = simplex[Seeds.Color].noise2D(1 + col * 0.2, 1 + row * 0.2) > 0 ? hues[1] : hues[2]
      const a = map(simplex[Seeds.Color].noise2D(col * 7, row * 7), -0.6, 0.6, 0.5, 1)
      c.fillStyle = hsla(h, 80, 50, a)

      drawShape({
        c,
        x: col * cellWidth + bleed,
        y: row * cellHeight + bleed,
        w: cellWidth * 2,
        h: cellHeight * 2,
        simplex: simplex[Seeds.Shape],
        noiseStart,
      })
    }
  }

  c.globalCompositeOperation = 'screen'
  for (let col = 0; col < GRID_COLUMNS; col++) {
    for (let row = 0; row < GRID_ROWS; row++) {
      const h = simplex[Seeds.Color].noise2D(1 + col * 0.2, 1 + row * 0.2) > 0 ? hues[3] : hues[4]
      const a = map(simplex[Seeds.Color].noise2D(col * 7, row * 7), -0.6, 0.6, 0.5, 1)
      c.fillStyle = hsla(h, 70, 50, a)

      drawShape({
        c,
        x: col * cellWidth + bleed,
        y: row * cellHeight + bleed,
        w: cellWidth,
        h: cellHeight,
        simplex: simplex[Seeds.Shape],
        noiseStart: noiseStart + 1, // different start to first layer
      })
    }
  }

  c.globalCompositeOperation = 'screen'
  c.globalAlpha = LINE_OPACITY

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = c.canvas.width
  tempCanvas.height = c.canvas.height
  const tempC = tempCanvas.getContext('2d') as CanvasRenderingContext2D
  tempC.setTransform(c.getTransform())

  tempC.lineWidth = LINE_WEIGHT
  const lineColor = hsl((hues[0] + 180) % 360, 100, 70)
  tempC.fillStyle = lineColor
  tempC.strokeStyle = lineColor

  for (let line = 0; line < LINE_COUNT; line++) {
    const x = Math.floor(randomFromNoise(simplex[Seeds.Lines].noise2D(7.4 + noiseStart * 0.01, 10 + line * 10)) * GRID_COLUMNS)
    const y = Math.floor(randomFromNoise(simplex[Seeds.Lines].noise2D(5.4 + noiseStart * 0.01, 100 + line * 10)) * GRID_ROWS)
    const size = Math.ceil(randomFromNoise(simplex[Seeds.Lines].noise2D(12 + line, 0.5 + noiseStart * 0.1)) * LINE_MAX_LENGTH) * cellWidth
    const rotate = simplex[Seeds.Lines].noise2D(123 + line * 30, 0.5) > 0 ? 1 : 0

    tempC.save()
    tempC.translate(bleed + (x + 0.5) * cellWidth, bleed + (y + 0.5) * cellHeight)
    tempC.rotate(rotate * Math.PI / 2)

    tempC.beginPath()
    tempC.moveTo(0, -size / 2)
    tempC.lineTo(0, size / 2)
    tempC.stroke()

    tempC.beginPath()
    tempC.arc(0, -size / 2, LINE_CAP_SIZE / 2, 0, Math.PI * 2)
    tempC.fill()

    tempC.beginPath()
    tempC.arc(0, size / 2, LINE_CAP_SIZE / 2, 0, Math.PI * 2)
    tempC.fill()

    tempC.restore()
  }
  c.drawImage(tempCanvas, 0, 0, width, height)

  c.restore()
}
