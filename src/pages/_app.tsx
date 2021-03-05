import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import PlausibleProvider, { usePlausible } from 'next-plausible'

import GlobalStyle from 'styles/base'
import { Env, EnvProvider } from 'env'

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  const plausible = usePlausible()

  return (
    <PlausibleProvider
      domain="abstractpuzzl.es"
      enabled={process.env.NEXT_PUBLIC_PLAUSIBLE_TRACKING === 'true'}
    >
      <EnvProvider
        env={process.env.NODE_ENV === 'development' ? Env.Dev : Env.Prod}
        setAppSketchId={(id) => router.push(`/app/${id}`)}
        trackEvent={(eventName: string, props?: object) =>
          plausible(eventName, props)
        }
      >
        <GlobalStyle />
        <Component {...pageProps} />
      </EnvProvider>
    </PlausibleProvider>
  )
}

export default App
