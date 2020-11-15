import chroma from 'chroma-js'
import { rotateHue } from 'utils/colorUtils'

export const STROKE_ATTEMPTS = 500
export const MAX_LENGTH = 150
export const MIN_LENGTH = 30
export const LENGTH_VARIATION = 25
export const DOT_ATTEMPTS = 3000
export const MIN_DOT_RADIUS = 2
export const MAX_DOT_RADIUS = 4
export const FLOW_FIDELITY = 0.6
export const DISTANCE_PER_FRAME = 1
export const AVOIDANCE_THRESHOLD = 1
export const THICKNESS = 5
export const THICKENSS_INCREMENT = 0

const COLORS = ['#FFEADB', '#FF61C5', '#7C4CF6', '#1B22F3', '#00438F']
export const COLOR_SCALE = chroma.scale(COLORS)
export const BACKGROUND = chroma(rotateHue(COLOR_SCALE(1), -30))
  .brighten(1)
  .hex()
