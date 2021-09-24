import { SketchConstructorSettings } from 'types'
export { design, Seeds as DesignNoiseSeeds } from './design'
export { cut, cutPieces, Seeds as CutNoiseSeeds } from '../046/cut'

export const settings = {
  width: 280,
  height: 280,
  bleed: 10,
  rows: 17,
  columns: 17,

  backgroundColor: '#5070d0',
} as SketchConstructorSettings
