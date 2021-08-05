import { SketchConstructorSettings } from 'types'
export { design, Seeds as DesignNoiseSeeds } from './design'
export { cut, cutPieces, Seeds as CutNoiseSeeds } from '../044/cut'

export const settings = {
  width: 280,
  height: 280,
  bleed: 10,
  rows: 15,
  columns: 15,

  backgroundColor: '#3d8f89',
} as SketchConstructorSettings
