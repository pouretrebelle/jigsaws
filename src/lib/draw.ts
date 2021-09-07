import { State } from 'types'
import SimplexNoise from 'simplex-noise'

interface DrawArgs {
  canvas: HTMLCanvasElement
  c: CanvasRenderingContext2D
  lineWidth: number
  state: State
}

const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

export const drawBackground = ({ canvas, c, state }: DrawArgs) => {
  if (!state.sketch) return

  c.fillStyle = state.sketch.settings.backgroundColor
  c.fillRect(0, 0, canvas.width, canvas.height)
}

export const drawRaster = ({ c, state }: Pick<DrawArgs, 'c' | 'state'>) => {
  if (!state.sketch) return

  const { bleedWidth, bleedHeight, bleed, ...rest } = state.sketch.settings

  const simplex = state.rasterNoiseSeeds.map((seed) => new SimplexNoise(seed))

  state.sketch.raster({
    c,
    createCanvas,
    simplex,
    seed: state.rasterNoiseSeeds,
    noiseStart: state.noiseStart,
    ...rest,
    width: bleedWidth,
    height: bleedHeight,
    bleed,
  })
}

export const drawVector = ({
  c,
  lineWidth,
  state,
}: Pick<DrawArgs, 'c' | 'lineWidth' | 'state'>) => {
  if (!state.sketch) return

  const { width, height, bleed, ...rest } = state.sketch.settings

  const simplex = state.vectorNoiseSeeds.map((seed) => new SimplexNoise(seed))

  c.save()
  c.lineWidth = lineWidth
  c.translate(bleed, bleed)
  state.sketch.vector({
    c,
    simplex,
    seed: state.vectorNoiseSeeds,
    ...rest,
    width,
    height,
  })
  c.restore()
}

export const drawGuides = ({ c, lineWidth, state }: DrawArgs) => {
  if (!state.sketch) return

  const { bleed, bleedWidth, bleedHeight } = state.sketch.settings

  // guides
  c.lineWidth = lineWidth / 2
  c.beginPath()

  // top left
  c.moveTo(bleed, 0)
  c.lineTo(bleed, bleed / 2)
  c.moveTo(0, bleed)
  c.lineTo(bleed / 2, bleed)

  // top right
  c.moveTo(bleedWidth - bleed, 0)
  c.lineTo(bleedWidth - bleed, bleed / 2)
  c.moveTo(bleedWidth - bleed / 2, bleed)
  c.lineTo(bleedWidth, bleed)

  // bottom left
  c.moveTo(0, bleedHeight - bleed)
  c.lineTo(bleed / 2, bleedHeight - bleed)
  c.moveTo(bleed, bleedHeight)
  c.lineTo(bleed, bleedHeight - bleed / 2)

  // bottom right
  c.moveTo(bleedWidth - bleed, bleedHeight)
  c.lineTo(bleedWidth - bleed, bleedHeight - bleed / 2)
  c.moveTo(bleedWidth - bleed / 2, bleedHeight - bleed)
  c.lineTo(bleedWidth, bleedHeight - bleed)
  c.stroke()
}
