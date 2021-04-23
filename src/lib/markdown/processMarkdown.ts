import unified from 'unified'
import markdown from 'remark-parse'
import toString from 'remark-stringify'
import strip from 'strip-markdown'

// Finds 3 digit numbers on their own and link them to the site root
export const wrapSketchLinks = (string: string) => string.replace(/([\s.,;?!(])([0-9]{3})([\s.,;?!)])/g, (_, before, id, after) => `${before}[${id}](/${id})${after}`)

export const getExcerpt = (string: string) => {
  const processor = unified()
    .use(markdown)
    .use(strip)
    .use(toString)

  const content = processor.processSync(string).toString()
  const description = content.split('\n\n').slice(2)

  if (description.length) return description[0].trim()
  return ''
}
