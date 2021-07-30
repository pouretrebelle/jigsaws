import styled from 'styled-components'

import {
  GithubIcon,
  InstagramIcon,
  TwitterIcon,
  YouTubeIcon,
} from 'components/Icon'

const StyledFooter = styled.footer`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  align-items: center;
  gap: 1em 3em;
  margin: 3em 0 0;
  padding-bottom: 1em;
  border-bottom: 0.2em solid rgb(var(--color-accent));
  flex: 1 0 0;
  align-items: flex-end;

  a:hover,
  a:focus-visible {
    color: rgb(var(--color-accent));
  }
`

const StyledSocials = styled.nav`
  display: flex;
  gap: 2em;
`

const StyledSocialLink = styled.a`
  width: 2em;

  svg {
    fill: currentColor;
  }
`

export const Footer = () => (
  <StyledFooter>
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
  </StyledFooter>
)
