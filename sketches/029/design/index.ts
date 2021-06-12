import SimplexNoise from 'simplex-noise'
import { Design } from 'types'
import { hsl, hsla } from 'utils/colorUtils'
import { map, randomFromNoise } from 'utils/numberUtils'

import {
  GRID_COLUMNS,
  GRID_ROWS,
  GRID_GAP_RATIO,
  LINE_WEIGHT,
} from './constants'

export enum Seeds {
  Shape,
  Color,
}

interface Shape {
  c: CanvasRenderingContext2D
  x: number
  y: number
  w: number
  h: number
  gap: number
  simplex: SimplexNoise
  noiseStart: number
}

const shapes = {
  blank: {
    weight: 7,
    draw: () => {},
  },
  pill: {
    weight: 3,
    draw: ({ c, x, y, w, h, gap, simplex }: Shape) => {
      const rotate = Math.floor(
        randomFromNoise(simplex.noise2D(100 + x, 100 + y)) * 2
      )
      c.rotate((rotate * Math.PI) / 2)
      c.beginPath()
      c.arc(0, (h + gap) / 2, (w - gap) / 2, 0, Math.PI)
      c.arc(0, -(h + gap) / 2, (w - gap) / 2, Math.PI, Math.PI * 2)
      c.fill()
    },
  },
  heart: {
    weight: 5,
    draw: ({ c, x, y, w, h, gap, simplex }: Shape) => {
      const rotate = Math.floor(
        randomFromNoise(simplex.noise2D(100 + x, 100 + y)) * 5
      )
      c.rotate((rotate * Math.PI) / 2)
      c.beginPath()
      c.arc(0, (h + gap) / 2, (w - gap) / 2, 0, Math.PI)
      c.lineTo(-(w - gap) / 2, (h - gap) / 2)
      c.arc(-(w + gap) / 2, 0, (w - gap) / 2, Math.PI * 0.5, Math.PI * 1.5)
      c.lineTo((w - gap) / 2, -(h - gap) / 2)
      c.fill()
    },
  },
}
const shapeKeys = Object.keys(shapes)
const shapeTotalWeights = shapeKeys.reduce(
  (prev, curr) => prev + shapes[curr as keyof typeof shapes].weight,
  0
)

const getShape = ({
  x,
  y,
  simplex,
  noiseStart,
}: Pick<Shape, 'x' | 'y' | 'simplex' | 'noiseStart'>) => {
  const shapeRand =
    randomFromNoise(
      simplex.noise3D(
        0.555 + x * 0.01,
        0.444 + y * 0.01,
        0.333 + noiseStart * 0.05
      )
    ) * shapeTotalWeights
  let shapeKey = shapeKeys[0] as keyof typeof shapes
  shapeKeys.reduce((prev, curr) => {
    if (prev < shapeRand) shapeKey = curr as keyof typeof shapes
    return prev + shapes[curr as keyof typeof shapes].weight
  }, 0)
  return shapeKey
}

const drawShape = (shape: keyof typeof shapes, args: Shape) => {
  const { c, x, y, w, h } = args

  c.save()
  c.translate(x + w / 2, y + h / 2)
  {
    shapes[shape].draw(args)
  }
  c.restore()
}

export const design = ({
  c,
  simplex,
  width,
  height,
  bleed,
  noiseStart,
}: Design) => {
  const hues: number[] = []
  for (let i = 0; i < 5; i++) {
    hues.push(
      Math.floor(
        randomFromNoise(simplex[Seeds.Color].noise2D(5.25 + i, 3.33)) * 360
      )
    )
  }
  c.save()

  c.fillStyle = hsl(hues[0], 40, 30)
  c.fillRect(0, 0, width, height)

  const cellWidth = (width - bleed * 2) / (GRID_COLUMNS + GRID_GAP_RATIO)
  const cellHeight = (height - bleed * 2) / (GRID_ROWS + GRID_GAP_RATIO)
  const gridGap = cellWidth * GRID_GAP_RATIO
  const gridBleed = bleed + gridGap / 2

  c.strokeStyle = hsla(0, 0, 100, 0.2)
  c.lineWidth = LINE_WEIGHT
  for (
    let col = 0;
    col < GRID_COLUMNS + GRID_GAP_RATIO;
    col += GRID_GAP_RATIO * 2
  ) {
    const x = col * cellWidth + gridBleed
    c.beginPath()
    c.moveTo(x, 0)
    c.lineTo(x, height)
    c.stroke()
  }
  for (
    let row = 0;
    row < GRID_ROWS + GRID_GAP_RATIO;
    row += GRID_GAP_RATIO * 2
  ) {
    const y = row * cellHeight + gridBleed
    c.beginPath()
    c.moveTo(0, y)
    c.lineTo(width, y)
    c.stroke()
  }

  c.globalCompositeOperation = 'screen'
  for (let col = -1; col < GRID_COLUMNS + 1; col += 3) {
    for (let row = -1; row < GRID_ROWS + 1; row += 3) {
      const a = map(
        simplex[Seeds.Color].noise2D(col * 7, row * 7),
        -0.6,
        0.6,
        0.5,
        1
      )
      c.fillStyle = hsla(hues[1], 80, 50, a)

      const x = col * cellWidth + gridBleed
      const y = row * cellHeight + gridBleed
      const shape = getShape({
        x,
        y,
        simplex: simplex[Seeds.Shape],
        noiseStart,
      })
      drawShape(shape, {
        c,
        x,
        y,
        w: cellWidth * 3,
        h: cellHeight * 3,
        gap: gridGap,
        simplex: simplex[Seeds.Shape],
        noiseStart,
      })
    }
  }

  c.globalCompositeOperation = 'multiply'
  for (let col = -0.5; col < GRID_COLUMNS + 0.5; col += 2) {
    for (let row = -0.5; row < GRID_ROWS + 0.5; row += 2) {
      const a = map(
        simplex[Seeds.Color].noise2D(col * 7, row * 7),
        -0.6,
        0.6,
        0.5,
        1
      )
      c.fillStyle = hsla(hues[2], 80, 50, a)

      // this layer doesn't add the line gap between shapes because it's on a half-grid
      const x = col * cellWidth + gridBleed - gridGap / 2
      const y = row * cellHeight + gridBleed - gridGap / 2
      const shape = getShape({
        x,
        y,
        simplex: simplex[Seeds.Shape],
        noiseStart: noiseStart + 1, // different start to first layer
      })
      drawShape(shape, {
        c,
        x,
        y,
        w: cellWidth * 2 + gridGap,
        h: cellHeight * 2 + gridGap,
        gap: gridGap,
        simplex: simplex[Seeds.Shape],
        noiseStart: noiseStart + 1, // different start to first layer
      })
    }
  }

  c.globalCompositeOperation = 'screen'
  for (let col = 0; col < GRID_COLUMNS; col++) {
    for (let row = 0; row < GRID_ROWS; row++) {
      const x = col * cellWidth + gridBleed
      const y = row * cellHeight + gridBleed
      const shape = getShape({
        x,
        y,
        simplex: simplex[Seeds.Shape],
        noiseStart: noiseStart + 2, // different start to first layer
      })

      const a = map(
        simplex[Seeds.Color].noise2D(col * 7, row * 7),
        -0.6,
        0.6,
        0.5,
        1
      )
      c.fillStyle = hsla(shape === 'pill' ? hues[3] : hues[4], 70, 50, a)

      drawShape(shape, {
        c,
        x,
        y,
        w: cellWidth,
        gap: gridGap,
        h: cellHeight,
        simplex: simplex[Seeds.Shape],
        noiseStart: noiseStart + 2, // different start to first layer
      })
    }
  }

  c.restore()
}
