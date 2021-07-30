import styled from 'styled-components'
import type { GetStaticProps } from 'next'
import Link from 'next/link'

import { getAllSketchContent } from 'lib/data/getAllSketchContent'
import { useSetLocalStorageSeeds } from 'lib/hooks/useSetLocalStorageSeeds'
import { SketchContent } from 'types'
import { COLOR } from 'styles/tokens'
import { SEO } from 'components/SEO'
import { PageWrapper } from 'components/PageWrapper'
import { Button } from 'components/Button'
import { FollowButton } from 'components/Button/FollowButton'
import { CloudinaryImage } from 'components/CloudinaryImage'

interface Props {
  latestSketch: SketchContent
}

const BREAKPOINT = '800px'

const StyledDescription = styled.aside`
  margin: 0 0 1em;
  font-size: 1.5em;
  line-height: 1.4;
  max-width: calc(300px + 50%);

  > *:not(:last-child) {
    margin-bottom: 0.5em;
  }
`

const StyledGrid = styled.div`
  @media (min-width: ${BREAKPOINT}) {
    margin-top: 3em;
    display: grid;
    gap: 1em 3em;
    grid-template-columns: 2fr 1fr 1fr;
  }
`

const StyledPuzzleLink = styled.div`
  grid-area: 1 / 1 / 2 / 2;
  margin-bottom: 1em;
`

const StyledPuzzlePhoto = styled.div`
  grid-area: 2 / 1 / 3 / 3;
`

const StyledPuzzleCut = styled.div`
  grid-area: 1 / 2 / 3 / 4;

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`

const HomePage = ({ latestSketch }: Props) => {
  // Set storage to sketch's seeds so the app opens with these values
  useSetLocalStorageSeeds(latestSketch)

  return (
    <PageWrapper accentColorRgb={latestSketch.accentColorRgb}>
      <SEO imagePath={latestSketch.imagePath.solveMiddle} />

      <StyledDescription>
        <p>
          Abstract Puzzles is a{' '}
          <a href="https://charlottedann.com">Charlotte Dann</a> project,
          exploring generative art through the medium of jigsaw design.
        </p>
        <p>
          Every week I create a new generative jigsaw program in the browser and
          laser cut one of the variations to solve and critique.
        </p>
      </StyledDescription>

      <StyledGrid>
        <StyledPuzzleLink>
          <Link href={latestSketch.pageLink} passHref>
            <Button>Read about the latest puzzle</Button>
          </Link>
        </StyledPuzzleLink>

        <StyledPuzzleCut>
          <CloudinaryImage
            imagePath={latestSketch.imagePath.cutWebsite}
            aspectRatio={1}
            wrapperStyle={{
              background: COLOR.BACKGROUND,
              color: COLOR.TEXT,
              margin: '-2em 0',
            }}
          />
        </StyledPuzzleCut>

        <StyledPuzzlePhoto>
          <CloudinaryImage
            imagePath={latestSketch.imagePath.solveMiddle}
            aspectRatio={9 / 16}
          />
        </StyledPuzzlePhoto>
      </StyledGrid>
    </PageWrapper>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const sketches = getAllSketchContent()

  return {
    props: {
      latestSketch: sketches.shift(),
    },
  }
}

export default HomePage
