import React from 'react'
import styled, { css } from 'styled-components'
import Link from 'next/link'

import { SketchContent } from 'types'
import { makeRandomSeedArray } from 'lib/seeds'
import { CloudinaryImage } from 'components/CloudinaryImage'
import { SketchCard } from 'components/SketchCard'
import { Button } from 'components/Button'
import RefreshButton from 'components/AppSidebar/Controls/RefreshButton'

import { Player } from './Player'
import ReactMarkdown from 'react-markdown'

const BP_MOBILE = '500px'
const BP_DESKTOP = '900px'

const StyledGrid = styled.article`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: 'video video' 'image details';
  grid-gap: 2em;
  margin: 3em 0;

  /* @media (max-width: ${BP_DESKTOP}) {
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
  } */

  @media (max-width: ${BP_MOBILE}) {
    margin: 2em 0;
    grid-gap: 1.5em;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto auto;
    grid-template-areas: 'image' 'details';
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

const StyledImageWrapper = styled.div`
  grid-area: image;
`

const StyledImage = styled.figure`
  position: sticky;
  top: 2em;
  bottom: 0;
  margin: 0;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  background: #000;
  text-align: center;
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
  grid-area: previews;
  /* display: grid;
  grid-gap: 2em;
  grid-template-columns: 1fr 1fr; */
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
  pieces,
  datePublished,
}: Props) => (
  <StyledGrid>
    {/* <StyledTitle>{id}</StyledTitle> */}

    <StyledVideo>
      <Player id={id} youTubeLink={youTubeLink} imagePath={imagePath} />
    </StyledVideo>

    <StyledImageWrapper>
      <StyledImage>
        <CloudinaryImage imagePath={imagePath.solveEnd} aspectRatio={1} />
        <p style={{ marginTop: '1em' }}>
          Posted{' '}
          {new Date(datePublished).toLocaleDateString('en-GB')}
        </p>
        <p>
          Solved 1h 43mins
          </p>
        <p style={{ marginBottom: '0.5em' }}>{pieces} pieces</p>
        <p>
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15 15"
            style={{ width: '1em', height: '1em', marginRight: '0.5em' }}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.97 3.47a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H.75a.75.75 0 010-1.5h11.69L9.97 4.53a.75.75 0 010-1.06z"
              fill="#000"
            />
          </svg>{' '}
          Previous puzzle
        </p>
        <p>
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15 15"
            style={{
              width: '1em',
              height: '1em',
              marginRight: '0.5em',
              transform: 'rotate(180deg)',
            }}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.97 3.47a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H.75a.75.75 0 010-1.5h11.69L9.97 4.53a.75.75 0 010-1.06z"
              fill="#000"
            />
          </svg>{' '}
          Next puzzle
        </p>
      </StyledImage>
    </StyledImageWrapper>
    {/* 
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
    </StyledActions> */}

    <StyledDetails>
      <ReactMarkdown
        // eslint-disable-next-line react/no-children-prop
        children={markdownDescription}
        disallowedTypes={['heading', 'image']}
        renderers={{
          link: LinkWrapper,
        }}
      />

      <h2 style={{ fontSize: '1.5em', margin: '1em 0 0' }}>Explore designs</h2>
      <p>
        <small>
          These designs have been generated on the fly from the code for this
          jigsaw:
        </small>
      </p>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridGap: '1em',
          margin: '0.5em 0',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <article key={i}>
            <CloudinaryImage
              imagePath={`0${parseInt(id) - 1 - i}_solve_end.jpg`}
              aspectRatio={1}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <small>{makeRandomSeedArray(4).join('_')}</small>
              <RefreshButton />
            </div>
          </article>
        ))}
      </section>

      <p>
        You can play with the parameters of this programme in{' '}
        <Link href={appLink} passHref>
          <a>the explorer</a>
        </Link>{' '}
        or check the code out{' '}
        <Link
          href={`https://github.com/pouretrebelle/jigsaws/tree/master/sketches/${id}`}
          passHref
        >
          <a>on GitHub</a>
        </Link>
        .
      </p>
    </StyledDetails>

    {/* <StyledPreviews>
      {previewSketches.map((sketch, i) => (
        <div key={sketch.id}>
          Go to {i === 0 ? 'next' : 'previous'} sketch - {sketch.id}
          <SketchCard key={sketch.id} {...sketch} />
        </div>
      ))}
    </StyledPreviews> */}
  </StyledGrid>
)
