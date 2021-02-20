import fs from 'fs'
import matter from 'gray-matter'
import { processMarkdown } from 'lib/markdown/processMarkdown'
import chroma from 'chroma-js'
import { SketchContent } from 'types'

const getRgb = (color: string): string => chroma(color).rgb().join(', ')

export const getSketchContent = (sketchId: string): SketchContent | null => {
  try {
    const file = fs.readFileSync(`sketches/${sketchId}/README.md`, 'utf8');
    const { content, data: { datePublished, youTubeLink, pieces, accentColor, designNoiseSeeds, cutNoiseSeeds, } } = matter(file)

    return {
      id: sketchId,
      html: processMarkdown(content),
      short: content.length < 500,
      accentColor,
      accentColorRgb: getRgb(accentColor || 'fuchsia'),
      datePublished: +datePublished,
      pieces,
      designNoiseSeeds,
      cutNoiseSeeds,
      youTubeLink,
      appLink: `/app/${sketchId}`,
      pageLink: `/${sketchId}`,
    }
  }
  catch (err) {
    console.error(`Cannot get content of sketch ${sketchId}`)
    return null
  }
}
