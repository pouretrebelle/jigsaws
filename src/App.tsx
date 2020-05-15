import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import GlobalStyle from 'styles/base'
import Demo from 'components/Demo'
import { SketchContext } from 'Provider'

const App = () => {
  const [{ sketch }] = useContext(SketchContext)

  return (
    <>
      <Helmet>
        <title>
          {sketch ? `${sketch.id} (Generative Jigsaws)` : 'Generative Jigsaws'}
        </title>
      </Helmet>
      <GlobalStyle />
      <Demo />
    </>
  )
}

export default App
