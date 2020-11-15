import chroma from 'chroma-js'

export const STROKE_ATTEMPTS = 200
export const MAX_LENGTH = 200
export const MIN_LENGTH = 30
export const LENGTH_VARIATION = 25
export const DOT_ATTEMPTS = 25000
export const MIN_DOT_RADIUS = 1
export const MAX_DOT_RADIUS = 100
export const FLOW_FIDELITY = 2
export const DISTANCE_PER_FRAME = 1
export const AVOIDANCE_THRESHOLD = 3
export const THICKNESS = 4
export const THICKENSS_INCREMENT = 0.1

export const COLOR_SCALE = chroma.cubehelix().gamma(0.5).scale()
export const BACKGROUND = '#fff'
