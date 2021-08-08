import React from 'react'
import styled from 'styled-components'

import { trim } from 'styles/helpers'

import Canvas from './Canvas'
import { AppSidebar } from './AppSidebar'

const BREAKPOINT = '700px'

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  min-height: 100%;

  @media (min-width: ${BREAKPOINT}) {
    flex-direction: row;
    height: 100%;
  }

  @media (max-width: ${BREAKPOINT}) {
    > *:nth-child(2) {
      flex: 0 0 100vw;
    }
  }
`

const StyledSidebar = styled.aside`
  background: #f8f8f8;
  padding: 2rem;
  ${trim}

  @media (max-width: ${BREAKPOINT}) {
    flex: 1 0 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    box-shadow: inset 0 30px 30px -30px rgba(0, 0, 0, 0.1);

    > * {
      margin: 0;
    }
  }

  @media (min-width: ${BREAKPOINT}) {
    overflow: auto;
    width: 220px;
    padding: 1.5rem 2rem 1.5rem 1.5rem;
    box-shadow: inset -30px 0 30px -30px rgba(0, 0, 0, 0.1);
  }
`

interface Props {
  accentColorRgb?: string
}

const Demo: React.FC<Props> = ({ accentColorRgb }) => (
  <StyledWrapper
    style={
      accentColorRgb ? ({ '--color-accent': accentColorRgb } as object) : {}
    }
  >
    <StyledSidebar>
      <AppSidebar />
    </StyledSidebar>
    <Canvas />
  </StyledWrapper>
)

export default Demo
