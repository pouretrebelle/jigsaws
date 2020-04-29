import React, { useContext } from 'react'
import styled from 'styled-components'
import RefreshButton from './RefreshButton'
import { Layer } from 'types'
import { updateSeed } from 'store/actions'
import { SketchContext } from 'Provider'

interface WrapperProps {
  $index: number
}

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  font-size: 0.75rem;
  margin: 0.25rem 0;

  ${({ $index }) =>
    $index !== undefined &&
    `
    &:before {
      content: "${$index}";
      display: inline-block;
      position: absolute;
      top: 1px;
      width: 1.5rem;
      padding: 0.25rem 0;
      text-align: center;
      border-right: 1px solid #ccc;
    }
  `};
`

const StyledInput = styled.input`
  width: 100%;
  padding: 0.25rem 0.5rem 0.25rem 2rem;
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: inherit;

  &:focus {
    border: 1px solid #aaa;
  }
`

const RefreshWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 1px;
  padding: 0.325rem;
  opacity: 0;
  transition: opacity 0.2s linear;

  ${Wrapper}:hover & {
    opacity: 1;
  }
`

interface Props {
  value: string
  layer: Layer
  index: number
}

const Input: React.FC<Props> = ({ value, layer, index, ...props }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = useContext(SketchContext)

  return (
    <Wrapper $index={index}>
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
    </Wrapper>
  )
}

export default Input
