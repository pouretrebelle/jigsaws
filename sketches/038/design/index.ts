import { Design } from 'types'
import { hsl } from 'utils/colorUtils'
import { randomFromNoise } from 'utils/numberUtils'
import {
  COLOR_COUNT,
  GRID_COLUMNS,
  GRID_FIDELITY_HORIZONTAL,
  GRID_FIDELITY_VERTICAL,
  GRID_ROWS,
} from './constants'

export enum Seeds {
  Color,
  Position,
}

export const design = ({
  c,
  simplex,
  width,
  height,
  bleed,
  noiseStart,
}: Design) => {
  c.save()

  c.fillStyle = 'blue'
  c.fillRect(0, 0, width, height)

  const hues: number[] = []
  for (let i = 0; i < COLOR_COUNT; i++) {
    hues.push(
      Math.floor(
        randomFromNoise(simplex[Seeds.Color].noise2D(235.25 + i, 123.33)) * 360
      )
    )
  }
  const colors = hues.map((h) => hsl(h, 50, 50))

  const getColorIndex = (col: number, row: number): number =>
    Math.floor(
      ((simplex[Seeds.Position].noise2D(
        col * GRID_FIDELITY_HORIZONTAL,
        row * GRID_FIDELITY_VERTICAL
      ) +
        1) /
        2) *
        colors.length
    )

  const w = width / GRID_ROWS
  const h = height / GRID_COLUMNS
  c.lineWidth = 0.1

  for (let col = 0; col < GRID_COLUMNS; col++) {
    for (let row = 0; row < GRID_ROWS; row++) {
      let x = w * col
      let y = h * row

      const m = { x: x + w / 2, y: y + h / 2 }
      const t = { x: x + w / 2, y: y }
      const r = { x: x + w, y: y + h / 2 }
      const b = { x: x + w / 2, y: y + h }
      const l = { x: x, y: y + h / 2 }
      const tl = { x: x, y: y }
      const tr = { x: x + w, y: y }
      const br = { x: x + w, y: y + h }
      const bl = { x: x, y: y + h }

      const drawTriangle = (
        colorIndex: number,
        corners: { x: number; y: number }[]
      ) => {
        c.fillStyle = colors[colorIndex]
        c.strokeStyle = colors[colorIndex]
        c.beginPath()
        corners.forEach(({ x, y }, i) => c[i === 0 ? 'moveTo' : 'lineTo'](x, y))
        c.fill()
        c.stroke()
      }

      type P = {
        x: number
        y: number
      }
      type U = [number, number]
      interface Triangle {
        corners: [P, P]
        main: U
        compare: [U, U]
      }

      const uN: U = [0, -1]
      const uE: U = [1, 0]
      const uS: U = [0, 1]
      const uW: U = [-1, 0]

      const triangles: Record<string, Triangle> = {
        nne: {
          corners: [t, tr],
          main: uN,
          compare: [uE, [1, -2]],
        },
        ene: {
          corners: [tr, r],
          main: uE,
          compare: [uN, [2, -1]],
        },
        ese: {
          corners: [r, br],
          main: uE,
          compare: [uS, [2, 1]],
        },
        sse: {
          corners: [br, b],
          main: uS,
          compare: [uE, [1, 2]],
        },
        ssw: {
          corners: [b, bl],
          main: uS,
          compare: [uW, [-1, 2]],
        },
        wsw: {
          corners: [bl, l],
          main: uW,
          compare: [uS, [-2, 1]],
        },
        wnw: {
          corners: [l, tl],
          main: uW,
          compare: [uN, [-2, -1]],
        },
        nnw: {
          corners: [tl, t],
          main: uN,
          compare: [uW, [-1, -2]],
        },
      }

      c.fillStyle = colors[getColorIndex(col + 0.5, row + 0.5)]
      c.fillRect(tl.x, tl.y, w, h)

      const getPos = ([uX, uY]: [number, number]): [number, number] => [
        col + 0.5 + uX / 2,
        row + 0.5 + uY / 2,
      ]

      Object.values(triangles).map(({ corners, main, compare }: Triangle) => {
        const colorIndex =
          getColorIndex(...getPos(compare[0])) ===
          getColorIndex(...getPos(compare[1]))
            ? getColorIndex(...getPos(compare[0]))
            : getColorIndex(...getPos(main))
        drawTriangle(colorIndex, [m, ...corners])
      })
    }
  }

  c.restore()
}
