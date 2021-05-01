import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { ResponsiveImage } from 'components/ResponsiveImage'

export const CLOUDINARY_URL =
  'https://res.cloudinary.com/abstract-puzzles/image/upload'

export const buildCloudinaryImageUrl = (
  path: string,
  options: Record<string, string | number>
) => {
  let params: string[] = []

  Object.keys(options).forEach((key) => {
    params.push(`${key}_${options[key]}`)
  })

  return `${CLOUDINARY_URL}/${params.join(',')}/${path}`
}

interface Props {
  imagePath: string
  options?: Record<string, string | number>
  aspectRatio?: number
}

export const CloudinaryImage: React.FC<Props> = ({
  imagePath,
  options,
  aspectRatio,
  ...props
}) => (
  <ResponsiveImage
    formatPath={({ width }) => {
      const dimensions: Props['options'] = { w: width }
      if (aspectRatio) {
        dimensions.h = Math.round(width * aspectRatio)
      }
      const imageOptions = Object.assign(
        {
          c: 'fill',
        },
        dimensions,
        options || {}
      )

      return buildCloudinaryImageUrl(imagePath, imageOptions)
    }}
    aspectRatio={aspectRatio}
    {...props}
  />
)
