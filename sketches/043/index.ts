import { SketchConstructorSettings } from 'types'
export { design, Seeds as DesignNoiseSeeds } from './design'
export { cut, cutPieces, Seeds as CutNoiseSeeds } from './cut'

export const settings = {
  width: 280,
  height: 280,
  bleed: 10,
  rows: 16,
  columns: 16,

  backgroundColor: '#e65052',
} as SketchConstructorSettings
