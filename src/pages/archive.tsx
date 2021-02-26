import type { GetStaticProps } from 'next'
import styled from 'styled-components'

import { getAllSketchContent } from 'lib/data/getAllSketchContent'
import { SketchContent } from 'types'
import { PageWrapper } from 'components/PageWrapper'
import { SketchCard } from 'components/SketchCard'

const StyledGrid = styled.section`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(2, 1fr);
  margin: 2em 0;

  @media (min-width: 500px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

interface Props {
  sketches: SketchContent[]
}

const ArchivePage = ({ sketches }: Props) => (
  <PageWrapper accentColorRgb={sketches[0].accentColorRgb} title="Archive">
    <StyledGrid>
      {sketches.map((sketch) => (
        <SketchCard key={sketch.id} {...sketch} />
      ))}
    </StyledGrid>
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
