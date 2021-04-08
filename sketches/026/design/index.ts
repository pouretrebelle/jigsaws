import SimplexNoise from 'simplex-noise'
import { Design } from 'types'
import { hsl, hsla } from 'utils/colorUtils'
import { map, randomFromNoise } from 'utils/numberUtils'

import { GRID_COLUMNS, GRID_ROWS } from './constants'

export enum Seeds {
  Shape,
  Color
}

interface Shape { c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, simplex: SimplexNoise }

const shapes = {
  blank: {
    weight: 1,
    draw: () => { }
  },
  circle: {
    weight: 1.5,
    draw: ({ c, w, h }: Shape) => {
      c.beginPath()
      c.arc(0, 0, w / 2, 0, Math.PI * 2)
      c.fill()
    },
  },
  semicirclepair: {
    weight: 1,
    draw: ({ c, x, y, w, h, simplex }: Shape) => {
      const rotate = Math.floor(randomFromNoise(simplex.noise2D(100 + x, 100 + y)) * 4)
      c.rotate(rotate * Math.PI / 2)
      c.beginPath()
      c.arc(0, 0, w / 2, 0, Math.PI)
      c.fill()
      c.beginPath()
      c.arc(0, -h / 2, w / 2, 0, Math.PI)
      c.fill()
    },
  },
  hourglass: {
    weight: 0.5,
    draw: ({ c, x, y, w, h, simplex }: Shape) => {
      const rotate = Math.floor(randomFromNoise(simplex.noise2D(100 + x, 100 + y)) * 4)
      c.rotate(rotate * Math.PI / 2)
      c.beginPath()
      c.arc(0, h / 2, w / 2, 0, Math.PI, true)
      c.fill()
      c.beginPath()
      c.arc(0, -h / 2, w / 2, 0, Math.PI)
      c.fill()
    },
  },
  square: {
    weight: 0.5,
    draw: ({ c, w, h }: Shape) => {
      // should be c.fillRect(-w / 2, -h / 2, w, h)
      // but it looks cuter offset
      c.fillRect(0, 0, w, h)
    }
  }
}
const shapeKeys = Object.keys(shapes)
const shapeTotalWeights = shapeKeys.reduce(
  (prev, curr) => (prev + shapes[curr as keyof typeof shapes].weight), 0
)

const drawShape = (args: Shape) => {
  const { c, x, y, w, h, simplex } = args

  const shapeRand = randomFromNoise(simplex.noise2D(3 + x * 5, 5 + y * 3)) * shapeTotalWeights
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
    hues.push(Math.floor(randomFromNoise(simplex[Seeds.Color].noise2D(5 + i, 3)) * 360))
  }
  c.save()

  c.fillStyle = hsl(hues[0], 40, 40)
  c.fillRect(0, 0, width, height)

  const cellWidth = (width - bleed * 2) / GRID_COLUMNS
  const cellHeight = (height - bleed * 2) / GRID_ROWS

  c.globalCompositeOperation = 'screen'
  for (let col = -0.5; col < GRID_COLUMNS + 0.5; col += 2) {
    for (let row = -0.5; row < GRID_ROWS + 0.5; row += 2) {
      const h = simplex[Seeds.Color].noise2D(1 + col * 0.2, 1 + row * 0.2) > 0 ? hues[1] : hues[2]
      const a = map(simplex[Seeds.Color].noise2D(col * 7, row * 7), -0.6, 0.6, 0.5, 1)
      c.fillStyle = hsla(h, 70, 50, a)

      drawShape({
        c,
        x: col * cellWidth + bleed, y: row * cellHeight + bleed, w: cellWidth * 2, h: cellHeight * 2,
        simplex: simplex[Seeds.Shape]
      })
    }
  }

  c.globalCompositeOperation = 'multiply'
  for (let col = 0; col < GRID_COLUMNS; col++) {
    for (let row = 0; row < GRID_ROWS; row++) {
      const h = simplex[Seeds.Color].noise2D(1 + col * 0.2, 1 + row * 0.2) > 0 ? hues[3] : hues[4]
      const a = map(simplex[Seeds.Color].noise2D(col * 7, row * 7), -0.6, 0.6, 0.5, 1)
      c.fillStyle = hsla(h, 70, 50, a)

      drawShape({
        c,
        x: col * cellWidth + bleed, y: row * cellHeight + bleed, w: cellWidth, h: cellHeight,
        simplex: simplex[Seeds.Shape]
      })
    }
  }

  c.restore()
}
