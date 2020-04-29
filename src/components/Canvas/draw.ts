import { State } from 'types'

interface DrawArgs {
  canvas: HTMLCanvasElement
  c: CanvasRenderingContext2D
  lineWidth: number
  state: State
}

export const drawBackground = ({ canvas, c, state }: DrawArgs) => {
  if (!state.sketch) return

  c.fillStyle = state.sketch.settings.backgroundColor
  c.fillRect(0, 0, canvas.width, canvas.height)
}

export const drawDesign = ({ c, state }: Pick<DrawArgs, 'c' | 'state'>) => {
  if (!state.sketch) return

  const { width, rows, columns, bleed } = state.sketch.settings
  const bleedWidth = width + bleed * 2

  state.sketch.design({
    c,
    seed: state.designNoiseSeeds,
    width: bleedWidth,
    height: bleedWidth,
    bleed: bleed,
    rows: rows,
    columns: columns,
  })
}

export const drawCut = ({
  c,
  lineWidth,
  state,
}: Pick<DrawArgs, 'c' | 'lineWidth' | 'state'>) => {
  if (!state.sketch) return

  const { width, rows, columns, bleed } = state.sketch.settings

  c.save()
  c.lineWidth = lineWidth
  c.translate(bleed, bleed)
  state.sketch.cut({
    c,
    seed: state.cutNoiseSeeds,
    width: width,
    height: width,
    rows: rows,
    columns: columns,
  })
  c.restore()
}

export const drawGuides = ({ c, lineWidth, state }: DrawArgs) => {
  if (!state.sketch) return

  const { width, bleed } = state.sketch.settings
  const bleedWidth = width + bleed * 2
  const bleedHeight = width + bleed * 2

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
