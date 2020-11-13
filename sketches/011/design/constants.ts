import chroma from 'chroma-js'

export const DOT_COUNT = 300
export const MAX_LENGTH = 250
export const LENGTH_VARIATION = 75
export const FLOW_FIDELITY = 1
export const DISTANCE_PER_FRAME = 1
export const AVOIDANCE_THRESHOLD = 1
export const THICKNESS = 1
export const THICKENSS_INCREMENT = 0.01

const COLORS = ['#FBEEDA', '#38FFB6', '#425BFF', '#7800A3',]// '#3D0016']
export const COLOR_SCALE = chroma.scale(COLORS)
export const BACKGROUND = COLOR_SCALE(1)
.brighten(1)
.desaturate(0.5)
  .hex()
