import React from 'react'
import ReactDOM from 'react-dom'
import Provider from 'Provider'
import Demo from 'components/Demo'
import GlobalStyle from 'styles/base'
import { getFromStorage } from 'lib/storage'

declare const SKETCH_IDS: string[]

const DevApp = () => {
  const sketchId = getFromStorage('sketch', [...SKETCH_IDS].pop())

  return (
    <React.StrictMode>
      <GlobalStyle />
      <Provider sketchIds={SKETCH_IDS} sketchId={sketchId}>
        <Demo />
      </Provider>
    </React.StrictMode>
  )
  }

ReactDOM.render(
  <DevApp />,
  document.getElementById('root')
)
