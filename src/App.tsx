import React from 'react'
import { Helmet } from 'react-helmet'
import GlobalStyle from 'styles/base'
import Demo from 'components/Demo'

const App = () => (
  <>
    <Helmet>
      <title>(Generative Jigsaws)</title>
    </Helmet>
    <GlobalStyle />
    <Demo />
  </>
)

export default App
