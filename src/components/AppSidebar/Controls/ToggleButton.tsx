import React from 'react'
import styled from 'styled-components'

interface Props {
  active: boolean
  title: string
  onClick?: () => void
}

interface ButtonProps {
  active: boolean
}

const StyledToggleButton = styled.button<ButtonProps>`
  width: 1rem;
  height: 1rem;
  vertical-align: text-top;
  margin-right: 0.5rem;
  border-radius: 50% 50%;
  cursor: pointer;
  outline: none;
  background: ${({ active }): string => (active ? '#3ad663' : '#ccc')};
`

const ToggleButton: React.FC<Props> = (props) => (
  <StyledToggleButton {...props} />
)

export default ToggleButton
