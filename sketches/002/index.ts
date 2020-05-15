import { BACKGROUND } from './design/constants'
import { SketchConstructorSettings } from 'types'
export { design } from './design'
export { cut } from './cut'

export const settings = {
  width: 280,
  height: 280,
  bleed: 10,
  rows: 14,
  columns: 14,

  cutNoiseSeeds: 4,
  designNoiseSeeds: 5,

  backgroundColor: BACKGROUND,
} as SketchConstructorSettings
