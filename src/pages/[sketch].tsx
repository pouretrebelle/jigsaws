import type { GetStaticPaths, GetStaticProps } from 'next'

import { getSketchIds } from 'lib/data/getSketchIds'
import { getSketchContent } from 'lib/data/getSketchContent'
import { SketchContent } from 'types'
import { PageWrapper } from 'components/PageWrapper'
import { SketchCard } from 'components/SketchCard'
import { SketchPreview } from 'components/SketchPreview'

const NOW = new Date()

const getSurroundingIds = (id: string, ids: string[]): string[] => {
  const idIndex = ids.indexOf(id)

  if (idIndex < 0 || ids.length <= 5) return []

  if (idIndex === 0) return ids.slice(1, 5)
  if (idIndex === 1) return [ids[0], ...ids.slice(2, 5)]
  if (idIndex === ids.length - 1) return ids.slice(-5, -1)
  if (idIndex === ids.length - 2)
    return [...ids.slice(-5, -2), ids[ids.length - 1]]

  return [
    ids[idIndex - 2],
    ids[idIndex - 1],
    ids[idIndex + 1],
    ids[idIndex + 2],
  ]
}

interface Props {
  sketch: SketchContent
  previewSketches: SketchContent[]
}

const SketchPage = ({ sketch, previewSketches }: Props) => (
  <PageWrapper accentColorRgb={sketch.accentColorRgb} title={sketch.id}>
    <SketchCard {...sketch} />
    <SketchPreview sketches={previewSketches} />
  </PageWrapper>
)

export const getStaticPaths: GetStaticPaths = async () => {
  const sketchIds = getSketchIds()
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
  const sketchIds = getSketchIds()
  const sketches = sketchIds
    .map(getSketchContent)
    .filter(({ datePublished }) => datePublished - +NOW < 0)
    .sort(({ datePublished: aDate }, { datePublished: bDate }) => bDate - aDate)

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
