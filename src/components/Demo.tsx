import React from 'react'
import styled from 'styled-components'

import { Env, ExceptEnv } from 'env'

import Selector from './Selector'
import Controls from './Controls'
import Canvas from './Canvas'
import { AppLinks } from './AppLinks'

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (min-width: 700px) {
    flex-direction: row;
  }
`

const StyledSidebar = styled.aside`
  background: #f8f8f8;
  padding: 1rem;
  min-height: 200px;
  max-height: calc(100vh - 100vw);
  overflow: auto;

  @media (min-width: 700px) {
    width: 200px;
    max-height: 100%;
    padding-right: 1.5rem;
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
      <ExceptEnv env={Env.Ide}>
        <AppLinks />
      </ExceptEnv>
      <Selector />
      <Controls />
    </StyledSidebar>
    <Canvas />
  </StyledWrapper>
)

export default Demo
