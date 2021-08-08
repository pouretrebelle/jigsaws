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

const StyledToggleButton = styled.button<{
  $active: Props['active']
}>`
  position: relative;
  width: 2rem;
  height: 1.2rem;
  vertical-align: text-bottom;
  margin-right: 0.6rem;
  border-radius: 0.6em;
  cursor: pointer;
  outline: none;
  transition: background 0.2s;
  background: #bbb;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.8em;
    height: 0.8em;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    transform: translate(-0.8em, -0.4em);
    transition: transform 0.2s;
  }

  ${({ $active }) =>
    $active &&
    `
    background: #06c777;
    &::before {
      transform: translate(0, -0.4em);
    }
  `};
`

const ToggleButton: React.FC<Props> = ({ active, ...props }) => (
  <StyledToggleButton
    type="button"
    role="switch"
    aria-checked={active}
    $active={active}
    {...props}
  />
)

export default ToggleButton
