import { SketchConstructorSettings } from 'types'
import { BACKGROUND } from './design/constants'
export { design, Seeds as DesignNoiseSeeds } from './design'
export { cut, cutPieces, Seeds as CutNoiseSeeds } from '../026/cut'

export const settings = {
  width: 280,
  height: 280,
  bleed: 10,
  rows: 11,
  columns: 11,
  backgroundColor: BACKGROUND,
} as SketchConstructorSettings
