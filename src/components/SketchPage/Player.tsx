import { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import YouTubePlayer from 'react-player/youtube'

import { SketchContent } from 'types'
import { CloudinaryImage } from 'components/CloudinaryImage'
import { EnvContext } from 'env'

const StyledYouTubeWrapper = styled.figure`
  width: 100%;
  height: 100%;
  position: absolute;
  margin: 0;
  top: 0;
`

const StyledButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  font-size: 3em;
  line-height: 0;
  padding: 0.25em;
  transform: translate(-50%, -50%);
  outline: 0;
  filter: drop-shadow(0 0 0.2em black);
`

const StyledButtonIcon = styled.svg`
  width: 1em;
  height: 1em;
  overflow: visible;
`

const StyledButtonIconOutline = styled.path`
  fill: transparent;
  stroke-width: 0.065em;
  stroke: rgb(var(--color-accent));
  opacity: 0;
  transition: opacity 0.1s linear;

  ${StyledButton}:hover & {
    opacity: 1;
  }

  ${StyledButton}:focus & {
    opacity: 1;
    fill: rgba(0, 0, 0, 0.5);
  }
`

const StyledButtonIconCenter = styled.path`
  fill: white;
`

const YouTubePlayerConfig = {
  playerVars: {
    rel: 0,
    controls: 1,
  },
}

type Props = Pick<SketchContent, 'youTubeLink' | 'id' | 'imagePath'>

export const Player: React.FC<Props> = ({ youTubeLink, imagePath, id }) => {
  const { trackEvent } = useContext(EnvContext)
  const [showVideo, setShowVideo] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setShowVideo(false)
    setIsPlaying(false)
  }, [id])

  const image = (
    <CloudinaryImage imagePath={imagePath.solveStart} aspectRatio={0.5625} />
  )

  if (!youTubeLink) return image

  const youTubeUrl = `https://www.youtube.com/watch?v=${youTubeLink
    .split('/')
    .pop()}`

  return (
    <>
      {image}
      {!showVideo && (
        <StyledButton
          onClick={() => {
            setShowVideo(true)
            setIsPlaying(true)
            trackEvent('Play video', { id })
          }}
          aria-label="Play video"
        >
          <StyledButtonIcon
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
          >
            <StyledButtonIconOutline
              d="M17.87.86l74.51 43.83c4.05 2.38 4.05 8.24 0 10.63L17.87 99.14c-4.11 2.42-9.29-.55-9.29-5.31V6.17c0-4.76 5.18-7.73 9.29-5.31z"
              fill="transparent"
              strokeWidth=""
            />
            <StyledButtonIconCenter d="M19.27 11.25l63.26 37.21c1.17.69 1.17 2.39 0 3.08L19.27 88.75c-1.19.7-2.69-.16-2.69-1.54V12.79c0-1.38 1.5-2.24 2.69-1.54z" />
          </StyledButtonIcon>
        </StyledButton>
      )}
      {showVideo && (
        <StyledYouTubeWrapper>
          <YouTubePlayer
            url={youTubeUrl}
            config={YouTubePlayerConfig}
            onPlay={(): void => setIsPlaying(true)}
            onPause={(): void => setIsPlaying(false)}
            playing={isPlaying}
            muted={true}
            controls
            width="100%"
            height="100%"
          />
        </StyledYouTubeWrapper>
      )}
    </>
  )
}
