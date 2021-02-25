import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

export const CLOUDINARY_URL =
  'https://res.cloudinary.com/abstract-puzzles/image/upload'

const buildCloudinaryImageUrl = (
  path: string,
  options: Record<string, string | number>
) => {
  let params: string[] = []

  Object.keys(options).forEach((key) => {
    params.push(`${key}_${options[key]}`)
  })

  return `${CLOUDINARY_URL}/${params.join(',')}/${path}`
}

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
  imagePath: string
  aspectRatio?: number
  options?: Record<string, string | number>
}

export const CloudinaryImage: React.FC<Props> = ({
  imagePath,
  aspectRatio,
  options,
  ...props
}) => {
  const imageWrapperElement = useRef<HTMLDivElement>(null)
  const imageElement = useRef<HTMLImageElement>(null)
  const [imageWidth, setImageWidth] = useState(0)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const pixelRatio = window.devicePixelRatio || 1
    const resizeObserver = new window.ResizeObserver((entries) => {
      const newWidth = entries[0].contentBoxSize[0].inlineSize * pixelRatio

      // don't resize if it's smaller than the current
      if (newWidth < imageWidth) return

      // round up to the nearest 50
      setImageWidth(Math.ceil(newWidth / 50) * 50)
    })

    const wrapperRef = imageWrapperElement.current
    if (wrapperRef) {
      resizeObserver.observe(wrapperRef)
    }
    return () => {
      if (wrapperRef) {
        resizeObserver.unobserve(wrapperRef)
      }
    }
  }, [])

  const dimensions: Props['options'] = { w: imageWidth }
  if (aspectRatio) {
    dimensions.h = Math.round(imageWidth * aspectRatio)
  }
  const imageOptions = Object.assign({}, dimensions, options || {})

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
          src={buildCloudinaryImageUrl(imagePath, imageOptions)}
          key={imagePath}
          $hasLoaded={hasLoaded}
          onLoad={() => setHasLoaded(true)}
          {...props}
        />
      )}
    </StyledWrapper>
  )
}
