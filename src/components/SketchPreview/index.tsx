import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'

import { SketchContent } from 'types'

const StyledGrid = styled.section`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(2, 1fr);
  margin: 2em 0;

  @media (min-width: 500px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const StyledLink = styled.a`
  text-decoration: none;
`

const StyledTitle = styled.h2`
  text-align: right;
  font-size: 2em;
  line-height: 0.9;
  margin-top: 0.25em;
`

const StyledImage = styled.figure`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
`

interface Props {
  sketches: SketchContent[]
}

export const SketchPreview = ({ sketches }: Props) => (
  <StyledGrid>
    {sketches.map(({ id, pageLink, accentColorRgb }) => (
      <Link key={id} href={pageLink} passHref>
        <StyledLink
          style={
            { '--color-accent': accentColorRgb } as object
          }
        >
          <StyledImage>
            <Image
              src={`/sketches/${id}_solve_end.jpg`}
              layout="fill"
              objectFit="cover"
            />
          </StyledImage>
          <StyledTitle>{id}</StyledTitle>
        </StyledLink>
      </Link>
    ))}
  </StyledGrid>
)
