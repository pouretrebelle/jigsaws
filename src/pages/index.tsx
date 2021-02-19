import type { GetStaticProps } from 'next'

import { getSketchIds } from 'lib/data/getSketchIds'
import { getAllSketchContent } from 'lib/data/getAllSketchContent'
import { SketchContent } from 'types'
import { PageWrapper } from 'components/PageWrapper'
import { SketchCard } from 'components/SketchCard'
import { SketchPreview } from 'components/SketchPreview'


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
  const sketches = getAllSketchContent()

  return {
    props: {
      latestSketch: sketches.shift(),
      previewSketches: sketches.slice(0, 4),
    },
  }
}

export default HomePage
