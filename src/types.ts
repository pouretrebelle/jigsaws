import SimplexNoise from 'simplex-noise'

export interface State {
  sketchIds: string[]
  sketchId: string
  sketch?: Sketch
  noiseStart: number
  cutVisible: boolean
  cutNoiseSeeds: string[]
  designVisible: boolean
  designNoiseSeeds: string[]
  pending: ActionType[]
  error?: {
    message?: string
  }
}

export enum ExportPart {
  Design = 'design',
  DesignAnimation = 'designAnimation',
  Cut = 'cut',
  CutPieces = 'cutPieces',
  CutWebsite = 'cutWebsite',
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
  ExportDesign = 'EXPORT_DESIGN',
  ExportDesignAnimation = 'EXPORT_DESIGN_ANIMATION',
  ExportCut = 'EXPORT_CUT',
  ExportCutPieces = 'EXPORT_CUT_PIECES',
  ExportCutWebsite = 'EXPORT_CUT_WEBSITE',
  ExportCanvas = 'EXPORT_CANVAS',
}

export interface Action {
  type: string
  payload: any
}

export type Thunk = (dispatch: React.Dispatch<Action>, state: State) => void

export type AugmentedDispatch = React.Dispatch<Thunk | Action>

export enum Layer {
  Cut = 'cut',
  Design = 'design',
}

export interface SketchConstructorSettings {
  width: number
  columns: number
  bleed: number
  height?: number
  rows?: number
  lineColor?: string
  backgroundColor?: string
  cutNoiseSeeds: string[]
  designNoiseSeeds: string[]
}

export interface SketchSettings {
  width: number
  height: number
  bleed: number
  rows: number
  columns: number
  lineColor: string
  backgroundColor: string
  cutNoiseSeeds: string[]
  designNoiseSeeds: string[]
  bleedWidth: number
  bleedHeight: number
  bleedRatio: number
}

export interface Sketch {
  id: string
  design: any
  cut: any
  cutPieces: any
  settings: SketchSettings
}

export interface Cut {
  c: CanvasRenderingContext2D
  simplex: SimplexNoise[]
  seed: string[]
  width: number
  height: number
  rows: number
  columns: number
}

export interface Design {
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

export interface SketchContent {
  id: string
  markdownDescription: string
  excerpt: string
  youTubeLink: string
  appLink: string
  pageLink: string
  designNoiseSeeds: string[]
  cutNoiseSeeds: string[]
  accentColor?: string
  accentColorRgb?: string
  datePublished: number
  pieces: number
  timeToSolve: string
  imagePath: {
    solveStart: string
    solveMiddle: string
    solveEnd: string
    cut: string
    canvas: string
  }
}
