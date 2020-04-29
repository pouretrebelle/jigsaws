import React from 'react'
import styled from 'styled-components'

interface Props {
  onClick?: () => void
}

const StyledRefreshButton = styled.button`
  outline: none;
  color: #777;
  transition: transform 0.2s ease;

  &:hover {
    color: #555;
    transform: rotate(45deg);
  }
`

const StyledIcon = styled.svg`
  fill: currentColor;
  width: 1rem;
  height: 1rem;
  vertical-align: middle;
`

const RefreshButton: React.FC<Props> = ({ onClick }) => (
  <StyledRefreshButton onClick={onClick}>
    <StyledIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125">
      <path d="M11.4 41.4a38.2 38.2 0 0 1 71.8-6.6H70v7.8h26.7V16.3h-7.9V28A46.7 46.7 0 0 0 3.4 40.8L3 42.4h8.1l.3-1zM88.9 57.6l-.3 1a38.2 38.2 0 0 1-71.8 6.6H30v-7.8H3.3v26.4h7.9V72a46.5 46.5 0 0 0 85.4-12.8l.4-1.6h-8.1z" />
    </StyledIcon>
  </StyledRefreshButton>
)

export default RefreshButton
