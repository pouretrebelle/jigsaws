import chroma from 'chroma-js'

export const DOT_COUNT = 300
export const COLOR_COUNT = 6
export const MAX_LENGTH = 50
export const MIN_LENGTH = 10
export const LENGTH_VARIATION = 10
export const FLOW_FIDELITY = 0.2
export const DISTANCE_PER_FRAME = 1
export const AVOIDANCE_THRESHOLD = 1
export const THICKNESS = 3
export const THICKENSS_INCREMENT = 0.5

export const COLOR_SCALE = chroma.scale('YlGnBu')
export const BACKGROUND = COLOR_SCALE(0.5).darken(1).desaturate(0.5).hex()
