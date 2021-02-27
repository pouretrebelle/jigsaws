import type { GetStaticProps } from 'next'

import { getAllSketchContent } from 'lib/data/getAllSketchContent'
import { SketchContent } from 'types'
import { SEO } from 'components/SEO'
import { PageWrapper } from 'components/PageWrapper'
import { SketchCard } from 'components/SketchCard'

interface Props {
  latestSketch: SketchContent
}

const HomePage = ({ latestSketch }: Props) => (
  <PageWrapper>
    <SEO imagePath={latestSketch.imagePath.solveEnd} />
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
