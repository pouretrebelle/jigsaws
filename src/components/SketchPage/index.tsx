import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)

import { SketchContent } from 'types'
import { COLOR } from 'styles/tokens'
import { BulletSeparator } from 'components/BulletSeparator'
import { Button } from 'components/Button'
import { CloudinaryImage } from 'components/CloudinaryImage'
import {
  SketchPreviewCard,
  PreviewProvider,
} from 'components/SketchPreviewCard'
import { SketchVariant } from 'components/SketchVariant'

import { Player } from './Player'

const BREAKPOINT = '800px'

const StyledGrid = styled.article`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 2fr 3fr;
  grid-template-areas: 'image preview' 'image details' 'video video';
  grid-gap: 2em;

  @media (max-width: ${BREAKPOINT}) {
    grid-template-columns: 1fr;
    grid-template-areas: 'image' 'mobile-nav' 'details' 'video';
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

const StyledVideo = styled.figure`
  margin: 0;
  grid-area: video;
  align-self: start;
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.35%;
  background: #000;
`

const StyledSidebar = styled.div`
  grid-area: image;

  @media (min-width: ${BREAKPOINT}) {
    margin: -2em 0;
  }
`

const StyledSidebarInner = styled.figure`
  top: 0;
  bottom: 0;
  margin: 0;

  @media (min-width: ${BREAKPOINT}) {
    position: sticky;
    padding: 2em 0;
    display: flex;
    gap: 2em;
    justify-content: space-between;
    flex-direction: column;
    max-height: 100vh;
    height: 100%;
  }
`

const StyledImageWrapper = styled.div`
  flex: 1 0 0;
`

const StyledImageLink = styled.a`
  display: block;
  position: sticky;
  top: 2em;
  bottom: 0;
  z-index: 1;
`

const StyledNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  position: sticky;
  bottom: 1em;

  > * {
    flex: 1 0 8em;
  }

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`

const StyledMobileNav = styled(StyledNav)`
  grid-area: mobile-nav;
  display: none;
  position: relative;
  bottom: 0;

  @media (max-width: ${BREAKPOINT}) {
    display: flex;
  }
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

const StyledMeta = styled.aside`
  font-style: italic;
  margin-top: 1.5em;
  font-size: 0.8em;

  @media (max-width: ${BREAKPOINT}) {
    font-size: 0.7em;
  }
`

const StyledPreviews = styled.div`
  grid-area: preview;

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`

const StyledPreviewGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1em;
`

const StyledPreviewDescription = styled.div`
  margin: 1em 0 0;
  font-size: 0.8em;

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`

const StyledDivider = styled.hr`
  margin: 1em 0 0;
  height: 0.1em;
  width: 100%;
  background: ${COLOR.DIVIDER};
  border: 0;
  border-radius: 0.1em;
`

const LinkWrapper: React.FC<{ href: string }> = ({ children, href }) => (
  <Link href={href} passHref>
    <StyledLink $internal={href.startsWith('/')}>{children}</StyledLink>
  </Link>
)

interface Props extends SketchContent {
  prevSketchLink?: string
  nextSketchLink?: string
}

export const SketchPage = ({
  id,
  datePublished,
  youTubeLink,
  appLink,
  imagePath,
  markdownDescription,
  pieces,
  timeToSolve,
  designNoiseSeeds,
  cutNoiseSeeds,
  nextSketchLink,
  prevSketchLink,
  cache,
}: Props) => {
  const navButtons = (
    <>
      <Link href={nextSketchLink || '/'} passHref>
        <Button disabled={!nextSketchLink}>Newer</Button>
      </Link>
      <Link href={prevSketchLink || '/'} passHref>
        <Button disabled={!prevSketchLink}>Older</Button>
      </Link>
    </>
  )
  const dayjsDatePublished = dayjs(datePublished)

  return (
    <StyledGrid>
      <StyledVideo>
        <Player id={id} youTubeLink={youTubeLink} imagePath={imagePath} />
      </StyledVideo>

      <StyledSidebar>
        <StyledSidebarInner>
          <StyledImageWrapper>
            <Link href={appLink} passHref>
              <StyledImageLink>
                <CloudinaryImage
                  imagePath={imagePath.solveEnd}
                  aspectRatio={1}
                />
              </StyledImageLink>
            </Link>
            <SketchVariant
              designNoiseSeeds={designNoiseSeeds}
              cutNoiseSeeds={cutNoiseSeeds}
            />
          </StyledImageWrapper>

          <StyledNav>{navButtons}</StyledNav>
        </StyledSidebarInner>
      </StyledSidebar>

      <StyledMobileNav>
        <Link href={appLink} passHref>
          <Button style={{ flexBasis: '100%' }}>Open in explorer</Button>
        </Link>
        {navButtons}
      </StyledMobileNav>

      <StyledDetails>
        <ReactMarkdown
          // eslint-disable-next-line react/no-children-prop
          children={markdownDescription}
          disallowedTypes={['heading', 'image']}
          renderers={{
            link: LinkWrapper,
          }}
        />
        <StyledMeta>
          <BulletSeparator as="ul">
            <li>{pieces} pieces</li>
            <li>Solved in {timeToSolve}</li>
            <li>
              Published on{' '}
              <time dateTime={dayjsDatePublished.format('YYYY-MM-DD')}>
                {dayjsDatePublished.format('Do MMMM ′YY')}
              </time>
            </li>
          </BulletSeparator>
        </StyledMeta>
      </StyledDetails>

      <StyledPreviews>
        <StyledPreviewGrid>
          <PreviewProvider
            designNoiseSeeds={designNoiseSeeds}
            cutNoiseSeeds={cutNoiseSeeds}
            cache={cache}
          >
            {[...Array(3)].map((_, i) => (
              <SketchPreviewCard key={i} id={id} />
            ))}
          </PreviewProvider>
        </StyledPreviewGrid>
        <StyledPreviewDescription>
          Each jigsaw is designed and developed entirely in the browser. Above
          are some random outputs generated on the fly just for you &ndash;
          crack open <Link href={appLink}>the explorer</Link> for finer control
          of the parameters.
          <StyledDivider />
        </StyledPreviewDescription>
      </StyledPreviews>
    </StyledGrid>
  )
}
