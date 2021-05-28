import { Design } from 'types'

import { BACKGROUND } from './constants'

export enum Seeds {
}

export const design = ({ c, simplex, width, height, noiseStart }: Design) => {
  c.fillStyle = BACKGROUND
  c.fillRect(0, 0, width, height)
}
