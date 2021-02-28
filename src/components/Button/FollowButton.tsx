import { useState } from 'react'
import styled from 'styled-components'

import { Button } from 'components/Button'
import { InstagramIcon, TwitterIcon, YouTubeIcon } from 'components/Icon'

const StyledButtonWrapper = styled.div`
  display: flex;
  flex: 1 0 10em;
  gap: 0.4em;

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
  const [showIcons, setShowIcons] = useState(false)

  if (!showIcons)
    return <Button onClick={() => setShowIcons(true)}>Follow along</Button>

  return (
    <StyledButtonWrapper>
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
  )
}
