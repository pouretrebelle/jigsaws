import React from 'react'
import styled from 'styled-components'

interface Props {
  active: boolean
  onClick?: () => void
}

interface ButtonProps {
  active: boolean
}

const StyledToggleButton = styled.button<ButtonProps>`
  width: 12px;
  height: 12px;
  vertical-align: middle;
  margin: 0 0 2px 6px;
  border-radius: 50% 50%;
  cursor: pointer;
  outline: none;
  background: ${({ active }): string => (active ? '#3ad663' : '#ccc')};
`

const ToggleButton: React.FC<Props> = ({ active, onClick }) => (
  <StyledToggleButton onClick={onClick} active={active}></StyledToggleButton>
)

export default ToggleButton
