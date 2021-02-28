import styled, { css } from 'styled-components'
import Link from 'next/link'

import { SketchContent } from 'types'
import { CloudinaryImage } from 'components/CloudinaryImage'
import { SketchCard } from 'components/SketchCard'
import { Button } from 'components/Button'

import { Player } from './Player'
import ReactMarkdown from 'react-markdown'

const BP_MOBILE = '500px'
const BP_DESKTOP = '900px'

const StyledGrid = styled.article`
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 3fr;
  grid-template-rows: auto auto auto 1fr;
  grid-template-areas: 'title title video video' 'image image video video' 'image image details details' 'empty actions details details';
  grid-gap: 2em;
  margin: 3em 0;

  @media (max-width: ${BP_DESKTOP}) {
    grid-template-columns: 1fr 2fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: 'title image' 'actions image' 'empty details';
  }

  @media (max-width: ${BP_MOBILE}) {
    margin: 2em 0;
    grid-gap: 1.5em;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto auto;
    grid-template-areas: 'title' 'image' 'actions' 'details' 'previews';
  }

  > * > *:first-child {
    margin-top: 0;
  }

  > * > *:last-child {
    margin-bottom: 0;
  }

  ::selection {
    background: rgba(var(--color-accent), 0.3);
  }
`

const StyledTitle = styled.h2`
  grid-area: title;
  align-self: end;
  margin: 0;
  font-size: 4em;
  font-weight: 700;
  line-height: 0.8;

  @media (min-width: ${BP_MOBILE}) {
    text-align: right;
  }
`

const StyledVideo = styled.figure`
  margin: 0;
  grid-area: video;
  align-self: start;
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.35%;
  background: #000;

  @media (max-width: ${BP_DESKTOP}) {
    display: none;
  }
`

const StyledImage = styled.figure`
  margin: 0;
  grid-area: image;
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  background: #000;
`

const StyledDetails = styled.div`
  grid-area: details;

  p {
    margin-bottom: 0.75em;

    &:empty {
      display: none;
    }
  }
`

const StyledActions = styled.nav`
  grid-area: actions;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr;
  align-self: start;
  margin: -0.5em 0 0;
  font-size: 0.75em;

  @media (min-width: ${BP_MOBILE}) {
    grid-template-columns: 1fr;
    margin: 0;
  }
`

const StyledButton = styled(Button)<{
  $hideOnDesktop?: boolean
  $wideOnMobile?: boolean
}>`
  ${({ $wideOnMobile }) =>
    $wideOnMobile &&
    `
    @media (max-width: ${BP_MOBILE}) {
      grid-column: span 2;
    }
  `}

  ${({ $hideOnDesktop }) =>
    $hideOnDesktop &&
    `
    @media (min-width: ${BP_DESKTOP}) {
      display: none !important;
    }
  `}
`

const StyledPreviews = styled.aside`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(2, 1fr);
  margin: 2em 0 0;
`

const StyledLink = styled.a<{ $internal: boolean }>`
  ${({ $internal }) =>
    $internal &&
    `
    display: inline-block;
    position: relative;
    padding: 0 0.3em;
    text-decoration: none;

    &::before {
      content: '';
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      border-radius: 0.1em;
      background: rgba(var(--color-accent), 0.2);
    }
  `}
`

const LinkWrapper: React.FC<{ href: string }> = ({ children, href }) => (
  <Link href={href} passHref>
    <StyledLink $internal={href.startsWith('/')}>{children}</StyledLink>
  </Link>
)

interface Props extends SketchContent {
  previewSketches: SketchContent[]
}

export const SketchPage = ({
  id,
  youTubeLink,
  appLink,
  imagePath,
  markdownDescription,
  previewSketches,
}: Props) => (
  <StyledGrid>
    <StyledTitle>{id}</StyledTitle>

    <StyledVideo>
      <Player id={id} youTubeLink={youTubeLink} imagePath={imagePath} />
    </StyledVideo>

    <StyledImage>
      <CloudinaryImage
        imagePath={imagePath.solveEnd}
        aspectRatio={1}
        options={{
          c: 'fill',
        }}
      />
    </StyledImage>

    <StyledActions>
      <Link href={appLink} passHref>
        <StyledButton $wideOnMobile>Open in explorer</StyledButton>
      </Link>
      <StyledButton
        href={`https://github.com/pouretrebelle/jigsaws/tree/master/sketches/${id}`}
      >
        Check out code
      </StyledButton>
      <StyledButton $hideOnDesktop href={youTubeLink}>
        Watch solve
      </StyledButton>
    </StyledActions>

    <StyledDetails>
      <ReactMarkdown
        // eslint-disable-next-line react/no-children-prop
        children={markdownDescription}
        disallowedTypes={['heading', 'image']}
        renderers={{
          link: LinkWrapper,
        }}
      />

      <StyledPreviews>
        {previewSketches.map((sketch) => (
          <SketchCard key={sketch.id} {...sketch} />
        ))}
      </StyledPreviews>
    </StyledDetails>
  </StyledGrid>
)
