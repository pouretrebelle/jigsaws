import React, { useContext } from 'react'
import styled from 'styled-components'
import RefreshButton from './RefreshButton'
import { Layer } from 'types'
import { updateSeed } from 'store/actions'
import { SketchContext } from 'Provider'


const StyledWrapper = styled.label`
  display: flex;
  position: relative;
  font-size: 0.75rem;
  margin: 0.25rem 0;
  border: 1px solid #ccc;
  border-radius: 3px;

  &:focus-within {
    border: 1px solid #aaa;
  }

  * {
    box-sizing: border-box;
  }
`

const StyledLabel = styled.span`
  flex: 1 0 50%;
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #f1f1f1;
  border-right: 1px solid #ccc;
`

const StyledInput = styled.input`
  width: 100%;
  flex: 1 1 50%;
  padding: 0.25rem 2rem 0.25rem 0.5rem;
  background: transparent;
  font-size: inherit;
`

const RefreshWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  padding: 0.325rem;
  opacity: 0.2;
  transition: opacity 0.2s linear;

  ${StyledWrapper}:hover & {
    opacity: 1;
  }
`

interface Props {
  label: string
  value: string
  layer: Layer
  index: number
}

const Input: React.FC<Props> = ({ label, value, layer, index, ...props }) => {
  const [, dispatch] = useContext(SketchContext)

  return (
    <StyledWrapper>
      <StyledLabel>{label}</StyledLabel>
      <StyledInput
        type="text"
        minLength={1}
        maxLength={5}
        value={value}
        onChange={(e) => dispatch(updateSeed(layer, index, e.target.value))}
      />

      <RefreshWrapper>
        <RefreshButton onClick={() => dispatch(updateSeed(layer, index))} />
      </RefreshWrapper>
    </StyledWrapper>
  )
}

export default Input
