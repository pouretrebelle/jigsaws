import styled from 'styled-components'
import Head from 'next/head'

import { Header } from 'components/Header'
import { Footer } from 'components/Footer'

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
  const faviconUrl = `/api/favicon.svg?color=rgb(${(
    accentColorRgb || ''
  ).replace(/ /g, '')})`

  return (
    <StyledWrapper
      style={
        accentColorRgb ? ({ '--color-accent': accentColorRgb } as object) : {}
      }
    >
      <Head>
        <title>{title && `${title} | `}Abstract Puzzles</title>

        <link rel="icon" href={faviconUrl} />
        <link rel="apple-touch-icon" href={faviconUrl} />
        <link
          rel="mask-icon"
          href={faviconUrl}
          color={`rgb(${accentColorRgb})`}
        />
      </Head>
      <Header />

      {children}

      <Footer />
    </StyledWrapper>
  )
}
