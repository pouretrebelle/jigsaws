import type { GetStaticProps } from 'next'

import { getSketchIds } from 'lib/data/getSketchIds'
import { getSketchContent } from 'lib/data/getSketchContent'
import { SketchContent } from 'types'
import { PageWrapper } from 'components/PageWrapper'
import { SketchCard } from 'components/SketchCard'
import { SketchPreview } from 'components/SketchPreview'

const NOW = new Date()

interface Props {
  latestSketch: SketchContent
  previewSketches: SketchContent[]
}

const HomePage = ({ latestSketch, previewSketches }: Props) => (
  <PageWrapper accentColorRgb={latestSketch.accentColorRgb}>
    <SketchCard {...latestSketch} />
    <SketchPreview sketches={previewSketches} />
  </PageWrapper>
)

export const getStaticProps: GetStaticProps = async () => {
  const sketchIds = getSketchIds()
  const sketches = sketchIds
    .map(getSketchContent)
    .filter(({ datePublished }) => datePublished - +NOW < 0)
    .sort(({ datePublished: aDate }, { datePublished: bDate }) => bDate - aDate)

  return {
    props: {
      latestSketch: sketches.shift(),
      previewSketches: sketches.slice(0, 4),
    },
  }
}

export default HomePage
