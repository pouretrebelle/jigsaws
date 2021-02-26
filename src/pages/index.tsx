import type { GetStaticProps } from 'next'

import { getAllSketchContent } from 'lib/data/getAllSketchContent'
import { SketchContent } from 'types'
import { PageWrapper } from 'components/PageWrapper'
import { SketchCard } from 'components/SketchCard'

interface Props {
  latestSketch: SketchContent
}

const HomePage = ({ latestSketch }: Props) => (
  <PageWrapper accentColorRgb={latestSketch.accentColorRgb}>
    <SketchCard {...latestSketch} />
  </PageWrapper>
)

export const getStaticProps: GetStaticProps = async () => {
  const sketches = getAllSketchContent()

  return {
    props: {
      latestSketch: sketches.shift(),
    },
  }
}

export default HomePage
