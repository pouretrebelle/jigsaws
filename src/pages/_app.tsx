import type { AppProps } from 'next/app'
import PlausibleProvider from 'next-plausible'

import GlobalStyle from 'styles/base'

const App = ({ Component, pageProps }: AppProps) => (
  <PlausibleProvider domain="abstractpuzzl.es">
    <GlobalStyle />
    <Component {...pageProps} />
  </PlausibleProvider>
)

export default App
