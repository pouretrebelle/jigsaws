import styled from 'styled-components'
import Link from 'next/link'

const StyledHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1em 2em;
  align-items: center;
  margin: 2em auto;

  @media (min-width: 900px) {
    grid-template-columns: 4fr 5fr;
    padding: 0;
    text-align: left;
  }
`

const StyledH1 = styled.h1`
  margin: 0;
  line-height: 1;
  font-size: 17vw;

  @media (min-width: 500px) {
    font-size: 10vw;
  }
  @media (min-width: 900px) {
    grid-column: 2/3;
    font-size: calc(4.6vw + 12px);
    margin-right: -1em;
  }

  a {
    text-decoration: none;
  }
`

const StyledDescription = styled.aside`
  font-size: 1.5em;

  @media (min-width: 900px) {
    font-size: 1.1em;
    grid-column: 2/3;
  }

  p {
    margin: 0 0 0.25em;
    line-height: 1.2;
  }
`

export const Header = () => (
  <StyledHeader>
    <StyledH1>
      <Link href="/">
        <a>Abstract Puzzles</a>
      </Link>
    </StyledH1>
    <StyledDescription>
      <p>A generative art jigsaw project by Charlotte&nbsp;Dann</p>
      <p>One new puzzle every week</p>
    </StyledDescription>
  </StyledHeader>
)
