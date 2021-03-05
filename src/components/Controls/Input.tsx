import React, { useContext } from 'react'
import styled from 'styled-components'
import RefreshButton from './RefreshButton'
import { Layer } from 'types'
import { updateSeed } from 'store/actions'
import { SketchContext } from 'store/Provider'

const StyledWrapper = styled.label`
  display: flex;
  position: relative;
  font-size: 0.75rem;
  margin: 0.25rem 0;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 1px 3px inset #ccc;

  * {
    box-sizing: border-box;
  }
`

const StyledLabel = styled.span`
  flex: 1 0 50%;
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #eee;
  box-shadow: 0 -1px 3px inset #ddd;
`

const StyledInput = styled.input`
  width: 100%;
  flex: 1 1 50%;
  padding: 0.25rem 2rem 0.25rem 0.5rem;
  background: transparent;
  font-size: inherit;

  &:focus {
    outline: 0;
  }
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
  onChange?: () => void
}

const Input: React.FC<Props> = ({
  label,
  value,
  layer,
  index,
  onChange,
  ...props
}) => {
  const [, dispatch] = useContext(SketchContext)

  return (
    <StyledWrapper>
      <StyledLabel>{label}</StyledLabel>
      <StyledInput
        type="text"
        minLength={1}
        maxLength={5}
        value={value}
        onChange={(e) => {
          dispatch(updateSeed(layer, index, e.target.value))
          if (onChange) onChange()
        }}
      />

      <RefreshWrapper>
        <RefreshButton
          onClick={() => {
            dispatch(updateSeed(layer, index))
            if (onChange) onChange()
          }}
        />
      </RefreshWrapper>
    </StyledWrapper>
  )
}

export default Input
