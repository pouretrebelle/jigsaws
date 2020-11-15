import chroma from 'chroma-js'

export const STROKE_ATTEMPTS = 5000
export const MAX_LENGTH = 150
export const MIN_LENGTH = 20
export const LENGTH_VARIATION = 25
export const DOT_ATTEMPTS = 0
export const MIN_DOT_RADIUS = 2
export const MAX_DOT_RADIUS = 4
export const FLOW_FIDELITY = 1.4
export const DISTANCE_PER_FRAME = 1
export const AVOIDANCE_THRESHOLD = 0
export const THICKNESS = 4
export const THICKENSS_INCREMENT = 0

const COLORS = ['#FFEADB', '#FF61C5', '#7C4CF6', '#1B22F3', '#00438F']
export const COLOR_SCALE = chroma.scale(COLORS)
export const BACKGROUND = '#3c44b5'
