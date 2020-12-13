export const STROKE_ATTEMPTS = 500
export const MAX_LENGTH = 150
export const LENGTH_VARIATION = 50
export const MIN_LENGTH = 10
export const FLOW_FIDELITY = 0.5
export const LAYER_SHIFT = 0.005
export const DISTANCE_PER_FRAME = 1
export const AVOIDANCE_THRESHOLD = 5
export const THICKNESS = 3
export const THICKENSS_INCREMENT = 0.1

export const BACKGROUND = 'hsl(170, 30%, 80%)'
export const LAYERS = [
  {
    color: 'hsl(150, 60%, 50%)',
    composite: 'normal',
  },
  {
    color: 'hsl(225, 100%, 80%)',
    composite: 'multiply',
  },
  {
    color: 'hsl(180, 100%, 80%)',
    composite: 'multiply',
  },
  {
    color: 'hsl(305, 100%, 50%)',
    composite: 'screen',
  },
]
