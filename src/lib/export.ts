import { saveAs } from 'file-saver'
import C2S from 'canvas2svg'
import WebMWriter from 'webm-writer'

import { State } from 'types'
import { drawDesign, drawCut, drawBackground } from 'lib/draw'

export const MM_TO_INCH = 0.0393701
export const LASER_CUT_SVG_MULTIPLIER = 3.7795
const CUT_EXPORT_WIDTH = 1000
const CANVAS_EXPORT_WIDTH = 2000
const CANVAS_EXPORT_LINE_WIDTH = 2
const ANIMATION_FRAMES = 500
const ANIMATION_EXPORT_WIDTH = 2000

export const formatSeeds = (seeds: string[]) => seeds.join('-')

export const exportCanvas = (state: State) => {
  const { sketch, designNoiseSeeds, cutNoiseSeeds } = state
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
  drawDesign(drawArgs)
  c.strokeStyle = lineColor
  drawCut(drawArgs)

  canvas.toBlob((blob) => {
    if (blob)
      saveAs(
        blob,
        `${sketch.id}_${formatSeeds(designNoiseSeeds)}_${formatSeeds(
          cutNoiseSeeds
        )}.png`
      )
  })
}

export const exportDesign = (state: State) => {
  const { sketch, designNoiseSeeds } = state
  if (!sketch) return

  const { width, height, bleed } = sketch.settings
  const scale = 300 * MM_TO_INCH

  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.width = (width + bleed * 2) * scale
  canvas.height = (height + bleed * 2) * scale

  const c = canvas.getContext('2d') as CanvasRenderingContext2D
  c.scale(scale, scale)

  drawDesign({ c, state })

  canvas.toBlob((blob) => {
    if (blob) saveAs(blob, `${sketch.id}_${formatSeeds(designNoiseSeeds)}.png`)
  })
}

export const exportDesignAnimation = (state: State) => {
  const FRAME_INCREMENT = 1 / ANIMATION_FRAMES

  const { sketch, designNoiseSeeds } = state
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
    drawDesign({ c, state: { ...state, noiseStart: i * FRAME_INCREMENT } })
    videoWriter.addFrame(canvas)
    console.info(`add frame ${i + 1}/${ANIMATION_FRAMES}`)
  }
  c.restore()

  videoWriter.complete().then((blob: Blob) => {
    saveAs(blob, `${sketch.id}_${formatSeeds(designNoiseSeeds)}.webm`)
  })
}

export const exportCut = (state: State) => {
  const { sketch, cutNoiseSeeds } = state
  if (!sketch) return

  const { width, height, bleed } = sketch.settings

  let c = new C2S(
    LASER_CUT_SVG_MULTIPLIER * (width + bleed * 2),
    LASER_CUT_SVG_MULTIPLIER * (height + bleed * 2)
  )
  c.scale(LASER_CUT_SVG_MULTIPLIER)
  drawCut({ c, lineWidth: 0.1, state }, false)

  const blob = new Blob([c.getSerializedSvg()], {
    type: 'text/plain',
  })

  saveAs(blob, `${sketch.id}_${formatSeeds(cutNoiseSeeds)}.svg`)
}

export const exportCutPieces = (state: State) => {
  const { sketch, cutNoiseSeeds } = state
  if (!sketch) return

  const { width, height, bleed } = sketch.settings

  let c = new C2S(CUT_EXPORT_WIDTH, (CUT_EXPORT_WIDTH * height) / width)
  c.scale(CUT_EXPORT_WIDTH / width)
  c.translate(-bleed, -bleed) // don't include bleed in pieces export
  drawCut({ c, lineWidth: 0.1, state }, true)

  const blob = new Blob([c.getSerializedSvg()], {
    type: 'text/plain',
  })

  saveAs(blob, `${sketch.id}_pieces_${formatSeeds(cutNoiseSeeds)}.svg`)
}

export const exportCutWebsite = (state: State) => {
  const { sketch, cutNoiseSeeds } = state
  if (!sketch) return

  const { width, height, bleed } = sketch.settings
  const lineWidth = 0.5 // 0.5mm line

  let c = new C2S(CUT_EXPORT_WIDTH, (CUT_EXPORT_WIDTH * height) / width)
  c.lineJoin = 'bevel'
  c.lineCap = 'round'
  c.scale(CUT_EXPORT_WIDTH / (width + lineWidth))
  c.translate(-bleed + lineWidth / 2, -bleed + lineWidth / 2)
  drawCut({ c, lineWidth, state }, false)

  const blob = new Blob([c.getSerializedSvg()], {
    type: 'text/plain',
  })

  saveAs(blob, `${sketch.id}_website_${formatSeeds(cutNoiseSeeds)}.svg`)
}
