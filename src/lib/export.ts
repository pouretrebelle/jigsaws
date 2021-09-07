import { saveAs } from 'file-saver'
import C2S from 'canvas2svg'
import WebMWriter from 'webm-writer'

import { State } from 'types'
import { drawRaster, drawVector, drawBackground } from 'lib/draw'

export const MM_TO_INCH = 0.0393701
export const LASER_VECTOR_SVG_MULTIPLIER = 3.7795
const VECTOR_EXPORT_WIDTH = 1000
const CANVAS_EXPORT_WIDTH = 2000
const CANVAS_EXPORT_LINE_WIDTH = 5
const ANIMATION_FRAMES = 500
const ANIMATION_EXPORT_WIDTH = 2000

export const formatSeeds = (seeds: string[]) => seeds.join('-')

export const exportCanvas = (state: State) => {
  const { sketch, rasterNoiseSeeds, vectorNoiseSeeds } = state
  if (!sketch) return

  const { bleedWidth, bleedRatio, lineColor } = sketch.settings

  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.width = CANVAS_EXPORT_WIDTH
  canvas.height = CANVAS_EXPORT_WIDTH * bleedRatio

  const c = canvas.getContext('2d') as CanvasRenderingContext2D

  const scale = CANVAS_EXPORT_WIDTH / bleedWidth
  const drawArgs = {
    canvas,
    c,
    lineWidth: CANVAS_EXPORT_LINE_WIDTH / scale,
    state,
  }

  drawBackground(drawArgs)
  c.scale(scale, scale)
  if (sketch.raster) drawRaster(drawArgs)
  c.strokeStyle = lineColor
  if (sketch.vector) drawVector(drawArgs)

  canvas.toBlob((blob) => {
    if (blob)
      saveAs(
        blob,
        `${sketch.id}_${formatSeeds(rasterNoiseSeeds)}_${formatSeeds(
          vectorNoiseSeeds
        )}.png`
      )
  })
}

export const exportRaster = (state: State) => {
  const { sketch, rasterNoiseSeeds } = state
  if (!sketch) return

  const { width, height, bleed } = sketch.settings
  const scale = 300 * MM_TO_INCH

  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.width = (width + bleed * 2) * scale
  canvas.height = (height + bleed * 2) * scale

  const c = canvas.getContext('2d') as CanvasRenderingContext2D
  c.scale(scale, scale)

  drawRaster({ c, state })

  canvas.toBlob((blob) => {
    if (blob) saveAs(blob, `${sketch.id}_${formatSeeds(rasterNoiseSeeds)}.png`)
  })
}

export const exportRasterAnimation = (state: State) => {
  const FRAME_INCREMENT = 1 / ANIMATION_FRAMES

  const { sketch, rasterNoiseSeeds } = state
  if (!sketch) return

  const { bleedWidth, bleedRatio } = sketch.settings

  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.width = ANIMATION_EXPORT_WIDTH
  canvas.height = ANIMATION_EXPORT_WIDTH * bleedRatio

  const c = canvas.getContext('2d') as CanvasRenderingContext2D

  const scale = ANIMATION_EXPORT_WIDTH / bleedWidth
  const drawArgs = {
    canvas,
    c,
    lineWidth: CANVAS_EXPORT_LINE_WIDTH / scale,
    state,
  }

  const videoWriter = new WebMWriter({
    quality: 0.999,
    frameRate: 25,
  })

  c.save()
  drawBackground(drawArgs)
  c.scale(scale, scale)
  for (let i = 0; i < ANIMATION_FRAMES; i++) {
    drawRaster({ c, state: { ...state, noiseStart: i * FRAME_INCREMENT } })
    videoWriter.addFrame(canvas)
    console.info(`add frame ${i + 1}/${ANIMATION_FRAMES}`)
  }
  c.restore()

  videoWriter.complete().then((blob: Blob) => {
    saveAs(blob, `${sketch.id}_${formatSeeds(rasterNoiseSeeds)}.webm`)
  })
}

export const exportVector = (state: State) => {
  const { sketch, vectorNoiseSeeds } = state
  if (!sketch) return

  const { width, height, bleed } = sketch.settings

  let c = new C2S(
    LASER_VECTOR_SVG_MULTIPLIER * (width + bleed * 2),
    LASER_VECTOR_SVG_MULTIPLIER * (height + bleed * 2)
  )
  c.scale(LASER_VECTOR_SVG_MULTIPLIER)
  drawVector({ c, lineWidth: 0.1, state })

  const blob = new Blob([c.getSerializedSvg()], {
    type: 'text/plain',
  })

  saveAs(blob, `${sketch.id}_${formatSeeds(vectorNoiseSeeds)}.svg`)
}
