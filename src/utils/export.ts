import { saveAs } from 'file-saver'
import C2S from 'canvas2svg'
import { State } from 'types'
import { drawDesign, drawCut } from 'components/Canvas/draw'

const MM_TO_INCH = 0.0393701
const SVG_MULIPLIER = 3.7795

const formatSeeds = (seeds: string[]) => seeds.join('-')

export const exportCanvas = ({
  sketch,
  designNoiseSeeds,
  cutNoiseSeeds,
}: State) => {
  const [canvas] = document.getElementsByTagName('canvas')
  if (!canvas) return console.error('Cannot find canvas')
  if (!sketch) return

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

export const exportCut = (state: State) => {
  const { sketch, cutNoiseSeeds } = state
  if (!sketch) return

  const { width, height, bleed } = sketch.settings

  let c = new C2S(
    SVG_MULIPLIER * (width + bleed * 2),
    SVG_MULIPLIER * (height + bleed * 2)
  )
  c.scale(SVG_MULIPLIER)
  drawCut({ c, lineWidth: 0.1, state })

  const blob = new Blob([c.getSerializedSvg()], {
    type: 'text/plain',
  })

  saveAs(blob, `${sketch.id}_${formatSeeds(cutNoiseSeeds)}.svg`)
}
