import { BACKGROUND } from './design/constants'
import { SketchConstructorSettings } from 'types'
export { design } from './design'
export { cut } from './cut'

export const settings = {
  width: 280,
  height: 280,
  bleed: 10,
  rows: 16,
  columns: 16,

  cutNoiseSeeds: 4,
  designNoiseSeeds: 4,

  backgroundColor: BACKGROUND,
} as SketchConstructorSettings
