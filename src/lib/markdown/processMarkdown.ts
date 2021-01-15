import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import stringify from 'rehype-stringify'

export const processMarkdown = (string: string) => {
  const processor = unified()
    .use(markdown)
    .use(remark2rehype)
    .use(stringify)

  return processor.processSync(string).toString()
}
