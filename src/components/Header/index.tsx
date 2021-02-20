import styled from 'styled-components'
import Link from 'next/link'

const StyledHeader = styled.header`
  margin: 2em auto;

  @media (min-width: 900px) {
    text-align: center;
    margin-bottom: 3em;
  }
`

const StyledH1 = styled.h1`
  margin: 0;
  line-height: 1;
  font-size: 17vw;
  margin-bottom: 0.25em;

  @media (min-width: 900px) {
    font-size: calc(4.6vw + 12px);
    margin-right: -1em;
  }

  a {
    text-decoration: none;
  }
`

const StyledDescription = styled.aside`
  font-size: 1.5em;

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
