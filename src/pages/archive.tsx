import type { GetStaticProps } from 'next'

import { getAllSketchContent } from 'lib/data/getAllSketchContent'
import { SketchContent } from 'types'
import { PageWrapper } from 'components/PageWrapper'
import { SketchCard } from 'components/SketchCard'

interface Props {
  sketches: SketchContent[]
}

const ArchivePage = ({ sketches }: Props) => (
  <PageWrapper accentColorRgb={sketches[0].accentColorRgb} title="Archive">
    <SketchCard sketches={sketches} />
  </PageWrapper>
)

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      sketches: getAllSketchContent(),
    },
  }
}

export default ArchivePage
