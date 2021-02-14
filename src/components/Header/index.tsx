import styled from 'styled-components'
import Link from 'next/link'
import { GithubIcon, InstagramIcon, TwitterIcon, YouTubeIcon } from './Icon'

const StyledHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1em 2em;
  align-items: center;
  margin: 3em auto;

  @media (min-width: 500px) {
    grid-template-columns: 5fr 4fr;
    text-align: right;
  }
  @media (min-width: 700px) {
    grid-template-columns: 4fr 5fr;
  }
  @media (min-width: 900px) {
    padding: 0;
    text-align: left;
  }
`

const StyledSocials = styled.nav`
  display: flex;
  justify-content: space-between;
  @media (min-width: 900px) {
    justify-content: flex-end;
    gap: 2em;
  }
`

const StyledSocialLink = styled.a`
  width: 3em;

  &:hover,
  &:focus-visible {
    color: rgb(var(--color-accent));
  }

  svg {
    fill: currentColor;
  }
`

const StyledH1 = styled.h1`
  margin: 0;
  line-height: 1;
  font-size: 17vw;

  @media (min-width: 500px) {
    font-size: 7vw;
  }
  @media (min-width: 900px) {
    font-size: calc(4.6vw + 12px);
    margin-right: -1em;
  }

  a {
    text-decoration: none;
  }
`

const StyledDescription = styled.aside`
  grid-column: 1/-1;
  font-size: 1.5em;
  @media (min-width: 500px) {
    font-size: 1.1em;
  }
  @media (min-width: 900px) {
    grid-column: 2/3;
  }
  p {
    margin: 0 0 0.25em;
    line-height: 1.2;
  }
`

export const Header = () => (
  <StyledHeader>
    <StyledSocials>
      <StyledSocialLink href="https://instagram.com/abstractpuzzles/">
        <InstagramIcon />
      </StyledSocialLink>
      <StyledSocialLink href="https://youtube.com/channel/UCDcKvGgdl8Jf7mROVZlhjog">
        <YouTubeIcon />
      </StyledSocialLink>
      <StyledSocialLink href="https://twitter.com/abstractpuzzles">
        <TwitterIcon />
      </StyledSocialLink>
      <StyledSocialLink href="https://github.com/pouretrebelle/jigsaws">
        <GithubIcon />
      </StyledSocialLink>
    </StyledSocials>
    <StyledH1><Link href="/"><a>Abstract Puzzles</a></Link></StyledH1>
    <StyledDescription>
      <p>A generative art jigsaw project by Charlotte&nbsp;Dann</p>
      <p>One new puzzle every week</p>
    </StyledDescription>
  </StyledHeader>
)
