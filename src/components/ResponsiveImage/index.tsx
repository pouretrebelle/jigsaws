import { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'

export const spin = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`

const StyledWrapper = styled.figure<{ $hasAspectRatio: boolean }>`
  background: #111;
  color: rgba(255, 255, 255, 0.75);
  position: relative;

  ${({ $hasAspectRatio }) =>
    $hasAspectRatio &&
    `
      margin: 0;
      width: 100%;
      height: 0;
      overflow: hidden;
  `}
`

const StyledImage = styled.img<{ $hasLoaded: boolean }>`
  width: 100%;
  opacity: ${({ $hasLoaded }) => ($hasLoaded ? 1 : 0)};
  transition: opacity 0.1s linear;
`

const StyledLoader = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2em;
  height: 2em;
  margin: -1em;
  border: 0.125em solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  transition: opacity 0.2s linear;
  opacity: 0;
  animation: ${spin} 1s linear infinite;

  ${({ $visible }) => $visible && `opacity: 1;`}
`

const StyledTimeout = styled.svg<{ $visible: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2em;
  height: 2em;
  margin: -1em;
  fill: currentColor;
  transition: opacity 0.2s linear;
  opacity: 0;
  pointer-events: none;

  ${({ $visible }) => $visible && `opacity: 1;`}
`

interface Props {
  formatPath: ({ width }: { width: number }) => string
  aspectRatio?: number
  wrapperStyle?: Record<string, any>
}

export const ResponsiveImage: React.FC<Props> = ({
  formatPath,
  aspectRatio,
  wrapperStyle = {},
  ...props
}) => {
  const imageWrapperElement = useRef<HTMLDivElement>(null)
  const imageElement = useRef<HTMLImageElement>(null)
  const [imageWidth, setImageWidth] = useState(0)
  const [hasLoaded, setHasLoaded] = useState(false)
  const loadedRef = useRef(hasLoaded)
  loadedRef.current = hasLoaded

  const [showLoader, setShowLoader] = useState(false)
  const loaderTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [showTimeout, setShowTimeout] = useState(false)
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setHasLoaded(false)
    setShowLoader(false)
    setShowTimeout(false)
    if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current)
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current)

    loaderTimerRef.current = setTimeout(() => {
      if (!loadedRef.current) setShowLoader(true)
    }, 500)
    timeoutTimerRef.current = setTimeout(() => {
      if (!loadedRef.current) {
        setShowTimeout(true)
        setShowLoader(false)
      }
    }, 10000)
  }, [formatPath])

  const calculateWidth = () => {
    const pixelRatio = window.devicePixelRatio || 1
    const newWidth = imageWrapperElement?.current?.clientWidth

    // don't resize if it's smaller than the current
    if (!newWidth || newWidth * pixelRatio < imageWidth) return

    // round up to the nearest 50
    setImageWidth(Math.ceil((newWidth * pixelRatio) / 50) * 50)
  }

  useEffect(() => {
    calculateWidth()

    window.addEventListener('resize', calculateWidth)

    return () => {
      window.removeEventListener('resize', calculateWidth)
    }
  }, [])

  const onLoad = () => {
    setHasLoaded(true)
    setShowLoader(false)
    setShowTimeout(false)
  }

  return (
    <StyledWrapper
      ref={imageWrapperElement}
      $hasAspectRatio={!!aspectRatio}
      style={
        aspectRatio
          ? {
              paddingBottom: `${Math.round(aspectRatio * 10000) / 100}%`,
              ...wrapperStyle,
            }
          : wrapperStyle
      }
    >
      <StyledLoader $visible={showLoader} aria-hidden />
      <StyledTimeout
        $visible={showTimeout}
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        viewBox="0 0 16 16"
      >
        {showTimeout && (
          <title>
            Oh no this image couldn’t load, click here to open in explorer
            instead
          </title>
        )}
        <circle cx="5" cy="6" r="1" />
        <path d="M11 5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zM11.53 12.18C11.49 12.07 10.47 9.5 8 9.5c-2.48 0-3.49 2.42-3.54 2.53l-.93-.38C3.59 11.52 4.84 8.5 8 8.5c3.17 0 4.42 3.19 4.47 3.32l-.94.36z" />
        <circle cx="11" cy="6" r="1" />
      </StyledTimeout>
      {imageWidth !== 0 && (
        <StyledImage
          ref={imageElement}
          src={formatPath({ width: imageWidth })}
          $hasLoaded={hasLoaded}
          onLoad={onLoad}
          {...props}
        />
      )}
    </StyledWrapper>
  )
}
