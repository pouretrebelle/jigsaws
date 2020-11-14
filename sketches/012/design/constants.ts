import chroma from 'chroma-js'

export const STROKE_ATTEMPTS = 500
export const MAX_LENGTH = 150
export const MIN_LENGTH = 20
export const LENGTH_VARIATION = 30
export const DOT_ATTEMPTS = 3000
export const MIN_DOT_RADIUS = 2
export const MAX_DOT_RADIUS = 6
export const FLOW_FIDELITY = 0.6
export const DISTANCE_PER_FRAME = 1
export const AVOIDANCE_THRESHOLD = 2
export const THICKNESS = 2
export const THICKENSS_INCREMENT = 0.05

const COLORS = ['#FBEEDA', '#38FFB6', '#576DFF', '#E60099']
export const COLOR_SCALE = chroma.scale(COLORS)
export const BACKGROUND = COLOR_SCALE(0.8).darken(1).desaturate(2).hex()
