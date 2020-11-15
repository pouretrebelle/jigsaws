import chroma from 'chroma-js'

export const DOT_COUNT = 300
export const MAX_LENGTH = 150
export const LENGTH_VARIATION = 75
export const FLOW_FIDELITY = 0.5
export const DISTANCE_PER_FRAME = 1
export const AVOIDANCE_THRESHOLD = 2
export const THICKNESS = 4
export const THICKENSS_INCREMENT = 0.05

const COLORS = ['#FBEEDA', '#38FFB6', '#425BFF', '#7800A3', '#3D0016']
export const COLOR_SCALE = chroma.scale(COLORS)
export const BACKGROUND = '#d05fcf'
