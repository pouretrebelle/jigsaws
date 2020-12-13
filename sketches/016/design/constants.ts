export const STROKE_ATTEMPTS = 300
export const MAX_LENGTH = 150
export const LENGTH_VARIATION = 50
export const MIN_LENGTH = 10
export const FLOW_FIDELITY = 0.8
export const LAYER_SHIFT = 0.02
export const DISTANCE_PER_FRAME = 1
export const AVOIDANCE_THRESHOLD = 3
export const THICKNESS = 3
export const THICKENSS_INCREMENT = 0.1

export const BACKGROUND = 'hsl(305, 40%, 80%)'
export const LAYERS = [
  {
    color: 'hsl(170, 60%, 50%)',
    composite: 'normal',
    opacity: 1,
  },
  {
    color: 'hsl(325, 100%, 60%)',
    composite: 'normal',
    opacity: 0.75,
  },
  {
    color: 'hsl(225, 100%, 80%)',
    composite: 'multiply',
    opacity: 1,
  },
  {
    color: 'hsl(180, 100%, 40%)',
    composite: 'screen',
    opacity: 1,
  },
]
