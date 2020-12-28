import type { AppProps } from 'next/app'

import GlobalStyle from 'styles/base'

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <GlobalStyle />
    <Component {...pageProps} />
  </>
)

export default App
