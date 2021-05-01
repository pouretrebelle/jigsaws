import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.figure<{ $hasAspectRatio: boolean }>`
  background: black;
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

  useLayoutEffect(() => {
    setHasLoaded(false)
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
      {imageWidth !== 0 && (
        <StyledImage
          ref={imageElement}
          src={formatPath({ width: imageWidth })}
          $hasLoaded={hasLoaded}
          onLoad={() => setHasLoaded(true)}
          {...props}
        />
      )}
    </StyledWrapper>
  )
}
