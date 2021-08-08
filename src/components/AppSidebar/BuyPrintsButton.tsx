import React from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div``

const StyledButton = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  padding: 0.5rem;
  background: #eee;
  border-radius: 3px;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  box-shadow: 0 -1px 3px inset #ccc;
  text-decoration: none;

  &:hover {
    background: #e0e0e0;
  }

  &:active {
    box-shadow: 0 1px 3px inset #ccc;
    top: 1px;
  }
`

export const BuyPrintsButton: React.FC = () => (
  <StyledWrapper>
    <StyledButton href="http://eepurl.com/detgXX">
      Buy prints
      <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 15 15"
        style={{
          width: '1em',
          transform: 'rotate(-45deg)',
        }}
      >
        <path
          d="M9.97 3.47a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H.75a.75.75 0 010-1.5h11.69L9.97 4.53a.75.75 0 010-1.06z"
          fill="#000"
        />
      </svg>
    </StyledButton>
  </StyledWrapper>
)
