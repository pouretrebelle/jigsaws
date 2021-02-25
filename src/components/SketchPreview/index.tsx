import styled from 'styled-components'
import Link from 'next/link'

import { SketchContent } from 'types'
import { CloudinaryImage } from 'components/CloudinaryImage'

const StyledGrid = styled.section`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(2, 1fr);
  margin: 2em 0;

  @media (min-width: 500px) {
    grid-template-columns: repeat(4, 1fr);
    text-align: right;
  }
`

const StyledLink = styled.a`
  text-decoration: none;
`

const StyledTitle = styled.h2`
  font-size: 2em;
  line-height: 0.9;
  margin-bottom: 0.25em;
`

interface Props {
  sketches: SketchContent[]
}

export const SketchPreview = ({ sketches }: Props) => (
  <StyledGrid>
    {sketches.map(({ id, pageLink, accentColorRgb }) => (
      <Link key={id} href={pageLink} passHref>
        <StyledLink style={{ '--color-accent': accentColorRgb } as object}>
          <StyledTitle>{id}</StyledTitle>
          <CloudinaryImage
            imagePath={`${id}_solve_end.jpg`}
            aspectRatio={1}
            options={{
              c: 'fill',
            }}
          />
        </StyledLink>
      </Link>
    ))}
  </StyledGrid>
)
