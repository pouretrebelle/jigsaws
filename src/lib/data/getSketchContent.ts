import fs from 'fs'
import matter from 'gray-matter'
import chroma from 'chroma-js'

import { SketchContent } from 'types'
import { getExcerpt, wrapSketchLinks } from 'lib/markdown/processMarkdown'
import { formatDuration } from 'lib/formatting'
import { COLOR } from 'styles/tokens'

const getRgb = (color: string): string => chroma(color).rgb().join(', ')

export const getSketchContent = (sketchId: string): SketchContent | null => {
  try {
    const file = fs.readFileSync(`sketches/${sketchId}/README.md`, 'utf8');
    const { content, data: { datePublished, youTubeLink, pieces, timeToSolve, accentColor = COLOR.ACCENT, designNoiseSeeds, cutNoiseSeeds, } } = matter(file)
    const canvas = `${sketchId}_${designNoiseSeeds.join('-')}_${cutNoiseSeeds.join('-')}.png`

    return {
      id: sketchId,
      markdownDescription: wrapSketchLinks(content),
      excerpt: getExcerpt(content),
      accentColor,
      accentColorRgb: getRgb(accentColor),
      datePublished: +datePublished,
      pieces,
      timeToSolve: formatDuration(timeToSolve || 3600),
      designNoiseSeeds,
      cutNoiseSeeds,
      youTubeLink: youTubeLink || '',
      appLink: `/app/${sketchId}`,
      pageLink: `/${sketchId}`,
      imagePath: {
        solveStart: youTubeLink ? `${sketchId}_solve_start.jpg` : canvas,
        solveMiddle: youTubeLink ? `${sketchId}_solve_middle.jpg` : canvas,
        solveEnd: youTubeLink ? `${sketchId}_solve_end.jpg` : canvas,
        canvas,
      }
    }
  }
  catch (err) {
    console.error(`Cannot get content of sketch ${sketchId}`)
    return null
  }
}
