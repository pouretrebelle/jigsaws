import fs from 'fs'
import matter from 'gray-matter'

import { processMarkdown } from 'lib/markdown/processMarkdown'

export const getSketchContent = (sketchId: string) => {
  const file = fs.readFileSync(`sketches/${sketchId}/README.md`, 'utf8');
  const { content, data } = matter(file)

  return { id: sketchId, data, html: processMarkdown(content), short: content.length < 500 }
}
