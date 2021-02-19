import { SketchContent } from 'types'
import { getSketchIds } from './getSketchIds'
import { getSketchContent } from './getSketchContent'

const NOW = new Date()

export const getAllSketchContent = (previewMode?: boolean): SketchContent[] => {
  const sketchIds = getSketchIds()
  const unsortedSketches = sketchIds.map(getSketchContent) as SketchContent[]
  const sketches = unsortedSketches
    .filter(({ datePublished }) => previewMode || datePublished - +NOW < 0)
    .sort(({ datePublished: aDate }, { datePublished: bDate }) => bDate - aDate)
  return sketches
}
