import type { GetStaticPaths, GetStaticProps } from 'next'

import { getAllSketchContent } from 'lib/data/getAllSketchContent'
import { useSetLocalStorageSeeds } from 'lib/hooks/useSetLocalStorageSeeds'
import { SketchContent } from 'types'
import { SEO } from 'components/SEO'
import { PageWrapper } from 'components/PageWrapper'
import { SketchPage as SketchPageComponent } from 'components/SketchPage'

const NOW = new Date()

interface Props {
  sketch: SketchContent
  olderSketchId?: string
  newerSketchId?: string
}

const SketchPage = ({ sketch, ...props }: Props) => {
  // Set storage to sketch's seeds so the app opens with these values
  useSetLocalStorageSeeds(sketch)

  return (
    <PageWrapper
      accentColorRgb={sketch.accentColorRgb}
      title={`Abstract Puzzle ${sketch.id}`}
    >
      <SEO
        title={sketch.id}
        description={sketch.excerpt}
        imagePath={sketch.imagePath.solveEnd}
        smallImage
      />
      <SketchPageComponent {...sketch} {...props} />
    </PageWrapper>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const sketchIds = getAllSketchContent().map(({ id }) => id)

  const paths = sketchIds.map((sketch) => ({
    params: { sketch },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const sketchId = (params && params.sketch) as string
  const sketches = getAllSketchContent()
  const sketchIndex = sketches.findIndex(({ id }) => id === sketchId)
  const sketch = sketches[sketchIndex]

  let prevSketchLink = null,
    nextSketchLink = null
  if (sketchIndex !== sketches.length - 1)
    prevSketchLink = sketches[sketchIndex + 1].pageLink
  if (sketchIndex > 0) nextSketchLink = sketches[sketchIndex - 1].pageLink

  return {
    props: {
      sketch,
      prevSketchLink,
      nextSketchLink,
    },
  }
}

export default SketchPage
