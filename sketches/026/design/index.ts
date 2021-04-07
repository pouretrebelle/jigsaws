import { Design } from 'types'

export enum Seeds {}

export const design = ({ c, width, height }: Design) => {
  c.save()

  c.fillStyle = 'hotpink'
  c.fillRect(0, 0, width / 2, height / 2)

  c.restore()
}
