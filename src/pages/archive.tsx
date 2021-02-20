import type { GetStaticProps } from 'next'

import { getSketchIds } from 'lib/data/getSketchIds'
import { getSketchContent } from 'lib/data/getSketchContent'
import { SketchContent } from 'types'
import { PageWrapper } from 'components/PageWrapper'
import { SketchPreview } from 'components/SketchPreview'

const NOW = new Date()

interface Props {
  sketches: SketchContent[]
}

const ArchivePage = ({ sketches }: Props) => (
  <PageWrapper accentColorRgb={sketches[0].accentColorRgb} title="Archive">
    <SketchPreview sketches={sketches} />
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
      sketches,
    },
  }
}

export default ArchivePage
