import { Design } from 'types'

export enum Seeds {}

export const design = ({
  c,
  simplex,
  width,
  height,
  bleed,
  noiseStart,
}: Design) => {
  c.save()

  c.restore()
}
