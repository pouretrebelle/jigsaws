import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import PlausibleProvider from 'next-plausible'

import GlobalStyle from 'styles/base'
import { EnvProvider } from 'env'
import { Env } from 'types'

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()

  return (
    <PlausibleProvider domain="abstractpuzzl.es">
      <EnvProvider
        env={process.env.NODE_ENV === 'development' ? Env.Dev : Env.Prod}
        setAppSketchId={(id) => router.push(`/app/${id}`)}
      >
        <GlobalStyle />
        <Component {...pageProps} />
      </EnvProvider>
    </PlausibleProvider>
  )
}

export default App
