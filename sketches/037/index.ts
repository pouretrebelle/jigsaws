import { BACKGROUND } from './design/constants'
import { SketchConstructorSettings } from 'types'
export { design, Seeds as DesignNoiseSeeds } from './design'
export { cut, cutPieces, Seeds as CutNoiseSeeds } from './cut'

export const settings = {
  width: 280,
  height: 280,
  bleed: 10,
  rows: 15,
  columns: 15,

  backgroundColor: BACKGROUND,
} as SketchConstructorSettings
