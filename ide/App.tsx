import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Provider from 'store/Provider'
import { EnvProvider } from 'env'
import Demo from 'components/Demo'
import GlobalStyle from 'styles/base'
import { getFromStorage } from 'lib/storage'
import { Env } from 'types'

declare const SKETCH_IDS: string[]

const DevApp = () => {
  const [sketchId, setSketchId] = useState(
    getFromStorage('sketch', [...SKETCH_IDS].pop())
  )

  return (
    <React.StrictMode>
      <GlobalStyle />
      <Provider sketchIds={SKETCH_IDS} sketchId={sketchId}>
        <EnvProvider env={Env.Ide} setAppSketchId={(id) => setSketchId(id)}>
          <Demo />
        </EnvProvider>
      </Provider>
    </React.StrictMode>
  )
}

ReactDOM.render(<DevApp />, document.getElementById('root'))
