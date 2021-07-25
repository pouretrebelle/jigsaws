import styled from 'styled-components'
import Head from 'next/head'

import { Header } from 'components/Header'
import { Footer } from 'components/Footer'
import { Favicon } from 'components/Favicon'

const StyledWrapper = styled.div`
  font-size: clamp(16px, 32px, 1.5vw);
  padding: 0 2em;
  max-width: calc(250px + 70%);
  margin: 0 auto;
`

interface Props {
  accentColorRgb?: string
  title?: string
}

export const PageWrapper: React.FC<Props> = ({
  accentColorRgb,
  title,
  children,
}) => {
  let faviconUrl = '/api/favicon.svg'
  if (accentColorRgb)
    faviconUrl += `?color=rgb(${accentColorRgb.replace(/ /g, '')})`

  return (
    <StyledWrapper
      style={
        accentColorRgb ? ({ '--color-accent': accentColorRgb } as object) : {}
      }
    >
      <Favicon accentColorRgb={accentColorRgb} />
      <Header title={title} />

      {children}

      <Footer />
    </StyledWrapper>
  )
}
