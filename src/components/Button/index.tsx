import styled from 'styled-components'

const StyledButton = styled.a<{
  disabled?: boolean
}>`
  position: relative;
  display: flex;
  flex: 1 0 10em;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  cursor: pointer;
  background: transparent;
  padding: 0.75em;
  border: 0;
  border: 0.2em solid rgb(var(--color-accent));
  border-radius: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
  text-decoration: none;
  outline: 0;
  transition: box-shadow 0.1s linear;

  &:hover {
    box-shadow: 0 0 0 0.4em rgba(var(--color-accent), 0.05);
  }
  &:focus {
    box-shadow: 0 0 0 0.4em rgba(var(--color-accent), 0.1);
  }
  &:active {
    box-shadow: 0 0 0 0 rgba(var(--color-accent), 0.3);
  }

  ${({ disabled }) => disabled && `
    pointer-events: none;
    --color-accent: 200, 200, 200;
    opacity: 0.5;
  `}
`

export const Button = StyledButton
