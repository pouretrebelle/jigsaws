import { SketchConstructorSettings } from 'types'
export { design, Seeds as DesignNoiseSeeds } from './design'
export { cut, cutPieces, Seeds as CutNoiseSeeds } from './cut'

export const settings = {
  width: 280,
  height: 280,
  bleed: 10,
  rows: 14,
  columns: 14,

  backgroundColor: 'hsl(281, 60%, 40%)',
} as SketchConstructorSettings
