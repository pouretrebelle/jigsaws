import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Button } from 'components/Button'
import { InstagramIcon, TwitterIcon, YouTubeIcon } from 'components/Icon'

const StyledWrapper = styled.div`
  display: flex;
  flex: 1 0 10em;
  position: relative;
`

const hiddenState = css<{ $hidden: boolean }>`
  transition: opacity 0.4s linear;

  ${({ $hidden }) =>
    $hidden &&
    `
    opacity: 0;
    pointer-events: none;
    color: transparent;
    transition: opacity 0.4s linear, color 0.2s linear;
  `}
`

const StyledReveal = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  ${hiddenState}
`

const StyledButtonWrapper = styled.div`
  display: flex;
  flex: 1 0 10em;
  gap: 0.4em;
  ${hiddenState}

  ${Button} {
    flex-basis: 0;
    padding: 0.5em;
  }

  svg {
    width: 2em;
    height: 2em;
  }
`

const StyledTiny = styled.span`
  font-size: 0.6em;
  line-height: 1;
`

export const FollowButton = () => {
  const [showLinks, setShowLinks] = useState(false)

  return (
    <StyledWrapper>
      <StyledReveal $hidden={showLinks}>
        <Button onClick={() => setShowLinks(true)}>Follow along</Button>
      </StyledReveal>

      <StyledButtonWrapper $hidden={!showLinks}>
        <Button href="https://instagram.com/abstractpuzzles/">
          <InstagramIcon />
        </Button>
        <Button href="https://twitter.com/abstractpuzzles">
          <TwitterIcon />
        </Button>
        <Button href="https://youtube.com/channel/UCDcKvGgdl8Jf7mROVZlhjog">
          <YouTubeIcon />
        </Button>
        <Button href="http://eepurl.com/heo-U1">
          <StyledTiny>Shop email alert</StyledTiny>
        </Button>
      </StyledButtonWrapper>
    </StyledWrapper>
  )
}
