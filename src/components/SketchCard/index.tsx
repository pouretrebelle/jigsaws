import styled from 'styled-components'
import Link from 'next/link'

import { SketchContent } from 'types'
import { CloudinaryImage } from 'components/CloudinaryImage'

const StyledLink = styled.a`
  text-decoration: none;
`

const StyledTitle = styled.h2`
  font-size: 2em;
  line-height: 0.9;
  margin-bottom: 0.25em;

  @media (min-width: 500px) {
    text-align: right;
  }
`

export const SketchCard = ({
  id,
  pageLink,
  accentColorRgb,
  imagePath,
}: SketchContent) => (
  <Link href={pageLink} passHref>
    <StyledLink style={{ '--color-accent': accentColorRgb } as object}>
      {/* <StyledTitle>{id}</StyledTitle> */}
      <CloudinaryImage
        // imagePath={imagePath.solveEnd}
        // aspectRatio={1}
        imagePath={imagePath.solveMiddle}
        aspectRatio={9/16}
      />
    </StyledLink>
  </Link>
)
