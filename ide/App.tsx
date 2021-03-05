import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { SketchProvider } from 'store/Provider'
import { Env, EnvProvider } from 'env'
import Demo from 'components/Demo'
import GlobalStyle from 'styles/base'
import { getFromStorage } from 'lib/storage'

declare const SKETCH_IDS: string[]

const DevApp = () => {
  const [sketchId, setSketchId] = useState(
    getFromStorage('sketch', [...SKETCH_IDS].pop())
  )

  return (
    <React.StrictMode>
      <GlobalStyle />
      <SketchProvider sketchIds={SKETCH_IDS} sketchId={sketchId}>
        <EnvProvider env={Env.Ide} setAppSketchId={(id) => setSketchId(id)}>
          <Demo />
        </EnvProvider>
      </SketchProvider>
    </React.StrictMode>
  )
}

ReactDOM.render(<DevApp />, document.getElementById('root'))
