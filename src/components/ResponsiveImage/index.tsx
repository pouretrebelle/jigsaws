import { useState, useEffect, useLayoutEffect, useRef } from 'react'
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
  background: black;
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
  border: 0.125em solid rgba(255, 255, 255, 0.75);
  border-top-color: transparent;
  border-radius: 50%;
  transition: opacity 0.2s linear;
  opacity: 0;
  animation: ${spin} 1s linear infinite;

  ${({ $visible }) => $visible && `opacity: 1;`}
`

interface Props {
  formatPath: ({ width }: { width: number }) => string
  aspectRatio?: number
}

export const ResponsiveImage: React.FC<Props> = ({
  formatPath,
  aspectRatio,
  ...props
}) => {
  const imageWrapperElement = useRef<HTMLDivElement>(null)
  const imageElement = useRef<HTMLImageElement>(null)
  const [imageWidth, setImageWidth] = useState(0)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const loadedRef = useRef(hasLoaded)
  loadedRef.current = hasLoaded

  useLayoutEffect(() => {
    setHasLoaded(false)
    setTimeout(() => {
      if (!loadedRef.current) setShowLoader(true)
    }, 500)
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
  }

  return (
    <StyledWrapper
      ref={imageWrapperElement}
      $hasAspectRatio={!!aspectRatio}
      style={
        aspectRatio
          ? {
              paddingBottom: `${Math.round(aspectRatio * 10000) / 100}%`,
            }
          : {}
      }
    >
      <StyledLoader $visible={showLoader} aria-hidden />
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
