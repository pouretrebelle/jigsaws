import chroma from 'chroma-js'
import { Design } from 'types'
import { arrayValueFromRandom } from 'utils/arrayUtils'
import { map, randomFromNoise, signFromRandom } from 'utils/numberUtils'

import {
  STREAK_COUNT,
  STREAK_LAYER_COUNT,
  STREAK_MAX_RADIUS,
  STREAK_MIN_RADIUS,
  COLOR_COUNT,
  SPIN_RECT_COLUMNS,
  SPIN_RECT_MIN_HEIGHT,
  SPIN_RECT_MAX_HEIGHT,
  SPIN_RECT_ROWS,
  CIRCLES_PER_STREAK,
  SPIN_RECT_MIN_WIDTH,
  SPIN_RECT_MAX_WIDTH,
} from './constants'

export enum Seeds {
  Color,
  Position,
  Rotation,
  Size,
}

interface Streak {
  color: string
  circles: {
    x: number
    y: number
    radius: number
  }[]
}

export const design = ({
  c,
  simplex,
  width,
  height,
  bleed,
  noiseStart,
  createCanvas,
}: Design) => {
  const bigCanvas = createCanvas(c.canvas.width * 2, c.canvas.height * 2)
  const bigC = bigCanvas.getContext('2d') as CanvasRenderingContext2D
  bigC.setTransform(c.getTransform())

  const startHue = Math.floor(
    map(
      randomFromNoise(simplex[Seeds.Color].noise2D(1.456, 5.234)),
      0,
      1,
      160,
      360
    )
  )
  const hueRotation = Math.floor(
    map(
      randomFromNoise(simplex[Seeds.Color].noise2D(17.23, 5.241)),
      0,
      1,
      30,
      50
    )
  )
  const hues: number[] = []
  for (let hueI = 0; hueI < COLOR_COUNT + 1; hueI++) {
    hues.push((startHue + hueRotation * hueI) % 360)
  }

  bigC.fillStyle = chroma.lch(60, 40, hues[0]).hex()
  bigC.fillRect(0, 0, width * 2, height * 2)
  bigC.translate(width / 2, height / 2)
  bigC.save()

  const streaks: Streak[] = []

  for (
    let streakI = 0;
    streakI < STREAK_COUNT * STREAK_LAYER_COUNT;
    streakI++
  ) {
    const hue = arrayValueFromRandom(
      hues,
      randomFromNoise(simplex[Seeds.Color].noise2D(streakI, 0))
    )
    let color = chroma.lch(60, 60, hue)
    color = color.brighten(simplex[Seeds.Color].noise2D(streakI * 3.5, 4.6) * 4)

    const circles: Streak['circles'] = []
    for (let circleI = 0; circleI < CIRCLES_PER_STREAK; circleI++) {
      const radius = map(
        Math.pow(
          simplex[Seeds.Size].noise2D(streakI * 50 + circleI * 0.001, 123.45),
          2
        ),
        0,
        1,
        STREAK_MIN_RADIUS,
        STREAK_MAX_RADIUS
      )
      const increment = circleI * 0.001 + noiseStart
      const x = map(
        simplex[Seeds.Position].noise2D(streakI * 5 + 5.42 + increment, 78.1),
        -0.7,
        0.7,
        0,
        width
      )
      const y = map(
        simplex[Seeds.Position].noise2D(streakI * 5 + 123.4 + increment, 23.1),
        -0.7,
        0.7,
        0,
        height
      )
      circles.push({ x, y, radius })
    }

    const streak = {
      color: color.hex(),
      circles,
    }
    streaks.push(streak)
  }

  bigC.globalAlpha = 0.03
  for (let streakLayer = 0; streakLayer < STREAK_LAYER_COUNT; streakLayer++) {
    for (let streakI = 0; streakI < STREAK_COUNT; streakI++) {
      const streak = streaks[streakI + streakLayer * STREAK_COUNT]

      streak.circles.forEach(({ x, y, radius }) => {
        bigC.fillStyle = streak.color
        bigC.beginPath()
        bigC.arc(x, y, radius, 0, 2 * Math.PI)
        bigC.fill()
      })
    }
  }
  bigC.restore()

  const tempCanvas = createCanvas(c.canvas.width, c.canvas.height)
  const tempC = tempCanvas.getContext('2d') as CanvasRenderingContext2D
  tempC.setTransform(c.getTransform())
  const spinRects: {
    x: number
    y: number
    w: number
    h: number
    rotation: number
  }[] = []

  const unitX = (width - bleed * 2) / (SPIN_RECT_COLUMNS - 1)
  const unitY = (height - bleed * 2) / (SPIN_RECT_ROWS - 1)
  for (
    let spinCircleI = 0;
    spinCircleI < SPIN_RECT_ROWS * SPIN_RECT_COLUMNS;
    spinCircleI++
  ) {
    const x = bleed + unitX * (spinCircleI % SPIN_RECT_COLUMNS)
    const y = bleed + unitY * Math.floor(spinCircleI / SPIN_RECT_COLUMNS)

    const w = map(
      Math.pow(
        simplex[Seeds.Size].noise2D(13.2 + spinCircleI * 50, 6123.45),
        2
      ),
      0,
      1,
      SPIN_RECT_MIN_WIDTH,
      SPIN_RECT_MAX_WIDTH,
      true
    )
    const h = map(
      Math.pow(simplex[Seeds.Size].noise2D(13.2 + spinCircleI * 50, 123.45), 2),
      0,
      1,
      SPIN_RECT_MIN_HEIGHT,
      SPIN_RECT_MAX_HEIGHT,
      true
    )
    const rotation =
      Math.ceil(
        map(
          randomFromNoise(
            simplex[Seeds.Rotation].noise2D(43.21, spinCircleI * 12 + 0.5)
          ),
          0,
          1,
          1,
          5.5
        )
      ) *
      30 *
      signFromRandom(
        simplex[Seeds.Rotation].noise2D(43.21, spinCircleI * 12 + 532.5)
      )

    spinRects.push({ x, y, w, h, rotation })
  }

  bigC.globalAlpha = 0.75
  spinRects.forEach(({ x, y, w, h, rotation }) => {
    tempC.save()
    tempC.drawImage(bigC.canvas, -width / 2, -height / 2, width * 2, height * 2)
    tempC.restore()

    bigC.save()
    bigC.translate(x, y)
    bigC.rotate((rotation / 180) * Math.PI)
    bigC.translate(-x, -y)
    bigC.beginPath()
    bigC.rect(x - w / 2, y - h / 2, w, h)
    bigC.arc(x, y - h / 2, w / 2, 0, 2 * Math.PI)
    bigC.arc(x, y + h / 2, w / 2, 0, 2 * Math.PI)
    bigC.clip()
    bigC.drawImage(tempC.canvas, 0, 0, width, height)
    bigC.restore()
  })

  c.drawImage(bigC.canvas, -width / 2, -height / 2, width * 2, height * 2)
}
