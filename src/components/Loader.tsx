import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`

const Loader = styled.div`
  --border-width: 1px;
  --size: 1em;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: calc(-0.5 * var(--size));
  z-index: 10;
  width: var(--size);
  height: var(--size);
  box-sizing: border-box;
  border: var(--border-width) solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

export default Loader
