import { Design } from 'types'

export enum Seeds {
  Color,
  Position,
}

export const design = ({
  c,
  simplex,
  width,
  height,
  bleed,
  noiseStart,
}: Design) => {
  c.save()

  c.fillStyle = 'blue'
  c.fillRect(0, 0, width, height)

  c.restore()
}
