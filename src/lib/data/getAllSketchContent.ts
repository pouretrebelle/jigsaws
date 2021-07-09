import { SketchContent } from 'types'
import { getSketchIds } from './getSketchIds'
import { getSketchContent } from './getSketchContent'

const NOW = new Date()

export const getAllSketchContent = (): SketchContent[] => {
  const sketchIds = getSketchIds()
  const unsortedSketches = sketchIds.map(getSketchContent) as SketchContent[]
  const sketches = unsortedSketches
    .filter(
      ({ datePublished }) =>
        process.env.NODE_ENV === 'development' || datePublished - +NOW < 0
    )
    .sort(({ datePublished: aDate }, { datePublished: bDate }) => bDate - aDate)
  return sketches
}
