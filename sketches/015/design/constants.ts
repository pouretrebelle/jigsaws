import { scale } from 'chroma-js'

export const STROKE_ATTEMPTS = 5000
export const MAX_LENGTH = 250
export const LENGTH_VARIATION = 50
export const MIN_LENGTH = 0
export const FLOW_FIDELITY = 0.6
export const DISTANCE_PER_FRAME = 1
export const AVOIDANCE_THRESHOLD = 2
export const THICKNESS = 1
export const THICKENSS_INCREMENT = 0.1

export const BACKGROUND = '#4cd3bd'
export const COLOR_SCALE = scale([
  'hsl(295, 60%, 20%)',
  'hsl(300, 70%, 40%)',
  'hsl(304, 75%, 50%)',
  'hsl(305, 80%, 60%)',
  'hsl(310, 90%, 70%)',
  'hsl(315, 100%, 80%)',
  'hsl(320, 100%, 90%)',
])
