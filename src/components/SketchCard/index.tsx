import styled, { css } from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'

import { SketchContent } from 'types'
import chroma from 'chroma-js'

const StyledGrid = styled.article<{ $short?: boolean; $accentColor: string }>`
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 3fr;
  grid-template-rows: auto auto auto 1fr;
  grid-template-areas: 'title title video video' 'image image video video' 'image image details details' 'empty actions details details';
  grid-gap: 2em;

  padding: 0 2em;
  max-width: calc(200px + 70%);
  margin: 3em auto;
  font-size: clamp(16px, 32px, 1.5vw);
  --color-accent: ${({ $accentColor }) => $accentColor};

  @media (max-width: 900px) {
    grid-template-rows: 1fr auto auto;
    grid-template-areas: 'title title image image' 'video video image image' 'details details details actions';
  }
  @media (max-width: 500px) {
    margin: 2em 0;
    grid-gap: 1.5em;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto auto;
    grid-template-areas: 'title' 'image' 'actions' 'details';
  }

  ${({ $short }) =>
    $short &&
    css`
      grid-template-areas: 'title title video video' 'image image video video' 'image image actions details' 'empty empty actions details';
    `}

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

  @media (min-width: 500px) {
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

  @media (max-width: 500px) {
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
`

const StyledActions = styled.nav`
  grid-area: actions;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr;
  align-self: start;
  margin: -0.5em 0 0;
  font-size: 0.75em;

  @media (min-width: 500px) {
    grid-template-columns: 1fr;
    margin: 0;
  }
`

const StyledButton = styled.a`
  position: relative;
  width: 100%;
  cursor: pointer;
  background: transparent;
  padding: 0.75em;
  border: 0;
  border: 0.2em solid rgb(var(--color-accent));
  border-radius: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  outline: 0;
  transition: box-shadow 0.1s linear;

  &:hover {
    box-shadow: 0 0 0 0.4em rgba(var(--color-accent), 0.05);
  }
  &:focus {
    box-shadow: 0 0 0 0.4em rgba(var(--color-accent), 0.1);
  }
  &:active {
    box-shadow: 0 0 0 0 rgba(var(--color-accent), 0.3);
  }
`

const getRgb = (color: string): string => chroma(color).rgb().join(', ')

export const SketchCard = ({
  id,
  html,
  youTubeLink,
  appLink,
  accentColor,
}: SketchContent) => (
  <StyledGrid $short $accentColor={getRgb(accentColor || 'fuchsia')}>
    <StyledTitle>{id}</StyledTitle>

    <StyledVideo>
      <Image
        src={`/sketches/${id}_solve_start.jpg`}
        layout="fill"
        objectFit="cover"
      />
    </StyledVideo>

    <StyledImage>
      <Image
        src={`/sketches/${id}_solve_end.jpg`}
        layout="fill"
        objectFit="cover"
      />
    </StyledImage>

    <StyledActions>
      <Link href={appLink} passHref>
        <StyledButton>Open in explorer</StyledButton>
      </Link>
      <StyledButton
        href={`https://github.com/pouretrebelle/jigsaws/tree/master/sketches/${id}`}
      >
        Check out code
      </StyledButton>
      <StyledButton href={youTubeLink}>Watch solve</StyledButton>
    </StyledActions>

    <StyledDetails dangerouslySetInnerHTML={{ __html: html }} />
  </StyledGrid>
)
