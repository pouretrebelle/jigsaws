import type { GetStaticPaths, GetStaticProps } from 'next'

import { getAllSketchContent } from 'lib/data/getAllSketchContent'
import { useSetLocalStorageSeeds } from 'lib/hooks/useSetLocalStorageSeeds'
import { SketchContent } from 'types'
import { SEO } from 'components/SEO'
import { PageWrapper } from 'components/PageWrapper'
import { SketchPage as SketchPageComponent } from 'components/SketchPage'

const NOW = new Date()

const getSurroundingIds = (id: string, ids: string[]): string[] => {
  const idIndex = ids.indexOf(id)

  if (idIndex < 0 || ids.length <= 5) return []

  if (idIndex === 0) return ids.slice(1, 3)
  if (idIndex === ids.length - 1) return ids.slice(-3, -1)

  return [ids[idIndex - 1], ids[idIndex + 1]]
}

interface Props {
  sketch: SketchContent
  previewSketches: SketchContent[]
}

const SketchPage = ({ sketch, previewSketches }: Props) => {
  // Set storage to sketch's seeds so the app opens with these values
  useSetLocalStorageSeeds(sketch)

  return (
    <PageWrapper accentColorRgb={sketch.accentColorRgb}>
      <SEO
        title={sketch.id}
        description={sketch.excerpt}
        imagePath={sketch.imagePath.solveEnd}
        smallImage
      />
      <SketchPageComponent {...sketch} previewSketches={previewSketches} />
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
  const sketch = sketches.find(({ id }) => id === sketchId)

  const previewSketches = getSurroundingIds(
    sketchId,
    sketches.map(({ id }) => id)
  ).map((thisId) => sketches.find(({ id }) => id === thisId))

  return {
    props: {
      sketch,
      previewSketches,
    },
  }
}

export default SketchPage
