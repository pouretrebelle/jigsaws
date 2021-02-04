import { SketchConstructorSettings } from 'types'
import { BACKGROUND } from './design/constants'
export { design, Seeds as DesignNoiseSeeds } from './design'
export { cut, cutPieces, Seeds as CutNoiseSeeds } from '../001/cut'

export const settings = {
  width: 280,
  height: 280,
  bleed: 10,
  rows: 16,
  columns: 16,
  backgroundColor: BACKGROUND,
} as SketchConstructorSettings
