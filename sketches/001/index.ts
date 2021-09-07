import { BACKGROUND } from './raster/constants'
import { SketchConstructorSettings } from 'types'
export { raster, Seeds as RasterNoiseSeeds } from './raster'
export { vector, Seeds as VectorNoiseSeeds } from './vector'

export const settings = {
  width: 280,
  height: 280,
  bleed: 10,
  rows: 14,
  columns: 14,

  backgroundColor: BACKGROUND,
} as SketchConstructorSettings
