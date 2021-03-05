import React, { useContext } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import { SketchContext } from 'store/Provider'
import { GithubIcon } from 'components/Icon'

const StyledAppLinks = styled.aside`
  font-size: 1.5rem;
  display: flex;
  margin-bottom: 0.5rem;
  gap: 0.75rem;

  svg {
    display: block;
    width: 1em;
    height: 1em;
  }
`

const StyledAccentSwatch = styled.div`
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background-color: rgb(var(--color-accent));
  transition: background-color 0.5s linear;
`

export const AppLinks = () => {
  const [{ sketch }] = useContext(SketchContext)

  return (
    <StyledAppLinks>
      <Link href={`/${sketch?.id}`} passHref>
        <a title="Back to site">
          <StyledAccentSwatch />
        </a>
      </Link>
      <Link
        href={`https://github.com/pouretrebelle/jigsaws/tree/master/sketches/${sketch?.id}`}
        passHref
      >
        <a title="Check out code">
          <GithubIcon />
        </a>
      </Link>
    </StyledAppLinks>
  )
}
