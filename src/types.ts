import SimplexNoise from 'simplex-noise'

export interface State {
  sketchIds: string[]
  sketchId: string
  sketch?: Sketch
  noiseStart: number
  vectorVisible: boolean
  vectorNoiseSeeds: string[]
  rasterVisible: boolean
  rasterNoiseSeeds: string[]
  pending: ActionType[]
  error?: {
    message?: string
  }
}

export enum ExportPart {
  Raster = 'raster',
  RasterAnimation = 'rasterAnimation',
  Vector = 'vector',
  Canvas = 'canvas',
}

export enum ActionType {
  AddPending = 'ADD_PENDING',
  RemovePending = 'REMOVE_PENDING',
  LoadSketch = 'LOAD_SKETCH',
  LoadSketchError = 'LOAD_SKETCH_ERROR',
  ToggleVisibility = 'TOGGLE_VISIBILITY',
  UpdateSeed = 'UPDATE_SEED',
  UpdateNoiseStart = 'UPDATE_NOISE_START',
  ExportRaster = 'EXPORT_RASTER',
  ExportRasterAnimation = 'EXPORT_RASTER_ANIMATION',
  ExportVector = 'EXPORT_VECTOR',
  ExportCanvas = 'EXPORT_CANVAS',
}

export interface Action {
  type: string
  payload: any
}

export type Thunk = (dispatch: React.Dispatch<Action>, state: State) => void

export type AugmentedDispatch = React.Dispatch<Thunk | Action>

export enum Layer {
  Vector = 'vector',
  Raster = 'raster',
}

export interface SketchConstructorSettings {
  width: number
  columns: number
  bleed: number
  height?: number
  rows?: number
  lineColor?: string
  backgroundColor?: string
  vectorNoiseSeeds: string[]
  rasterNoiseSeeds: string[]
}

export interface SketchSettings {
  width: number
  height: number
  bleed: number
  rows: number
  columns: number
  lineColor: string
  backgroundColor: string
  vectorNoiseSeeds: string[]
  rasterNoiseSeeds: string[]
  bleedWidth: number
  bleedHeight: number
  bleedRatio: number
}

export interface Sketch {
  id: string
  raster?: any
  vector?: any
  settings: SketchSettings
}

export interface Vector {
  c: CanvasRenderingContext2D
  simplex: SimplexNoise[]
  seed: string[]
  width: number
  height: number
  rows: number
  columns: number
}

export interface Raster {
  c: CanvasRenderingContext2D
  createCanvas: (
    width: number,
    height: number
  ) => HTMLCanvasElement | OffscreenCanvas
  simplex: SimplexNoise[]
  seed: string[]
  width: number
  height: number
  bleed: number
  rows: number
  columns: number
  noiseStart: number
}
