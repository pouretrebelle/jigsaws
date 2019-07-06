import { css } from 'styled-components'

const reset = css`
  html,
  body,
  div,
  ol,
  h1,
  h2,
  h3,
  h4,
  h5,
  p,
  li,
  ul,
  a,
  select,
  header,
  footer,
  nav,
  fieldset,
  label,
  aside,
  input,
  textarea,
  figcaption {
    padding: 0;
    margin: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
    box-sizing: border-box;
  }

  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section,
  div,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  textarea,
  label {
    display: block;
  }

  ul,
  ol {
    list-style: none;
  }

  img {
    vertical-align: middle;
  }
`

export default reset
