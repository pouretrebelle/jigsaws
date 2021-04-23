import styled from 'styled-components'
import Link from 'next/link'

const StyledHeader = styled.header`
  margin: 2em auto 1em;

  @media (min-width: 500px) {
    text-align: center;
  }
`

const StyledH1 = styled.h1`
  margin: 0;
  line-height: 1;
  font-size: 17vw;
  margin-bottom: 0.25em;

  @media (min-width: 500px) {
    font-size: calc(4.6vw + 12px);
    margin-right: -0.1ch;
  }

  a {
    text-decoration: none;
  }
`

export const Header: React.FC = ({ children }) => (
  <StyledHeader>
    <StyledH1>
      <Link href="/">
        <a>{children}</a>
      </Link>
    </StyledH1>
  </StyledHeader>
)
