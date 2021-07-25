import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'

const StyledHeader = styled.header`
  margin: ${(2 / 1.5).toFixed(3)}em auto;
  line-height: 1;
  font-size: 1.5em;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1em;
`

const StyledH1 = styled.h1`
  margin: 0;
  min-height: 2em;

  a {
    text-decoration: none;
  }
`

const StyledNav = styled.nav`
  display: flex;
  gap: 1em;
`

const StyledLink = styled.a<{ $active: boolean }>`
  text-decoration: none;

  ${({ $active }) =>
    $active &&
    `
    text-decoration: underline;
  `}
`

const ActiveLink = ({ href, children }: { href: string; children: string }) => {
  const router = useRouter()

  return (
    <Link href={href} passHref>
      <StyledLink $active={router.pathname === href}>{children}</StyledLink>
    </Link>
  )
}

export const Header = ({ title }: { title?: string }) => (
  <StyledHeader>
    <StyledH1>
      <Link href="/">
        <a>
          Abstract Puzzles
          {title && (
            <>
              <br />
              {title}
            </>
          )}
        </a>
      </Link>
    </StyledH1>

    <StyledNav>
      <ActiveLink href="/archive">Archive</ActiveLink>
    </StyledNav>
  </StyledHeader>
)
