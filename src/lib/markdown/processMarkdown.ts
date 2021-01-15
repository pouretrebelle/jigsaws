import unified from 'unified'
import remove from 'unist-util-remove'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import stringify from 'rehype-stringify'

const stripElements: unified.Plugin<any[], { test: object }> = options => tree => {
  remove(tree, { cascade: true }, options.test)
}

export const processMarkdown = (string: string) => {
  const processor = unified()
    .use(markdown)
    .use(remark2rehype)
    .use(stripElements, { test: [{ tagName: 'h1' }, { tagName: 'img' }] })
    .use(stringify)

  return processor.processSync(string).toString()
}
