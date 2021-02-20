import fs from 'fs'
import matter from 'gray-matter'
import { processMarkdown } from 'lib/markdown/processMarkdown'
import chroma from 'chroma-js'

const getRgb = (color: string): string => chroma(color).rgb().join(', ')

export const getSketchContent = (sketchId: string) => {
  const file = fs.readFileSync(`sketches/${sketchId}/README.md`, 'utf8');
  const { content, data } = matter(file)

  return {
    id: sketchId,
    html: processMarkdown(content),
    short: content.length < 500,
    ...data,
    accentColorRgb: getRgb(data.accentColor || 'fuchsia'),
    datePublished: +data.datePublished,
    appLink: `/app/${sketchId}`,
    pageLink: `/${sketchId}`,
  }
}
