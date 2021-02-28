import styled from 'styled-components'
import type { GetStaticProps } from 'next'
import Link from 'next/link'

import { getAllSketchContent } from 'lib/data/getAllSketchContent'
import { SketchContent } from 'types'
import { SEO } from 'components/SEO'
import { PageWrapper } from 'components/PageWrapper'
import { Button } from 'components/Button'
import { FollowButton } from 'components/Button/FollowButton'
import { CloudinaryImage } from 'components/CloudinaryImage'

interface Props {
  latestSketch: SketchContent
}

const StyledDescription = styled.aside`
  margin: 0 0 1em;
  font-size: 1.5em;
  text-align: justify;
  line-height: 1.4;
`

const StyledButtonWrapper = styled.nav`
  margin: 0 0 2em;
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
`

const HomePage = ({ latestSketch }: Props) => (
  <PageWrapper accentColorRgb={latestSketch.accentColorRgb}>
    <SEO imagePath={latestSketch.imagePath.solveEnd} />

    <StyledDescription>
      <p>
        Abstract Puzzles is a generative art jigsaw project by{' '}
        <a href="https://charlottedann.com">Charlotte Dann</a>. Each puzzle is
        designed in the browser, both how the pieces are cut out and the design
        on its face. Every week I make a new design and create a laser-cut copy
        to solve — generative art is always more fun when it’s tactile.
      </p>
    </StyledDescription>

    <StyledButtonWrapper>
      <Link href={latestSketch.appLink} passHref>
        <Button>Open explorer</Button>
      </Link>
      <Link href={latestSketch.pageLink} passHref>
        <Button>Go to latest sketch</Button>
      </Link>
      <FollowButton />
    </StyledButtonWrapper>

    <Link href={latestSketch.pageLink}>
      <a>
        <CloudinaryImage imagePath={latestSketch.imagePath.solveMiddle} aspectRatio={9/16} />
      </a>
    </Link>
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
