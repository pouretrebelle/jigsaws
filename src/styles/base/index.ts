import { createGlobalStyle } from 'styled-components'
import { COLOR, FONT } from '../tokens'
import reset from './reset'

const GlobalStyle = createGlobalStyle`
  ${reset}

  :root {
    --color-accent: 254, 104, 255; // COLOR.ACCENT RGB
  }

  html {
    width: 100%;
  }

  body {
    overflow-x: hidden;
    background: ${COLOR.BACKGROUND};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
  }

  #__next, #root {
    height: 100%;
  }

  ::selection {
    background-color: #fffdd3;
  }
  
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type='number'] {
    -moz-appearance: textfield;
  }
  
  textarea,
  input[type='text'],
  input[type='email'],
  input[type='password'],
  input[type='submit'] {
    -webkit-appearance: none;
    box-shadow: none;
  }
  
  button {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
  
  body,
  input,
  textarea,
  select {
    font-family: ${FONT.FAMILY.BODY};
    font-size: 16px;
    font-weight: normal;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
    color: ${COLOR.TEXT};
  }

  a {
    color: inherit;
    text-decoration-color: rgb(var(--color-accent));
    text-underline-offset: 0.05em;
  }

  a:focus,
  button:focus {
    outline: 0;
  }

  a:focus-visible,
  button:focus-visible {
    outline: 2px solid rgb(var(--color-accent));
  }
`

export default GlobalStyle
