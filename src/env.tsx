import { createContext, useContext } from 'react'

export enum Env {
  Ide = 'ide',
  Dev = 'development',
  Prod = 'production',
}

type SetAppSketchId = (sketchId: string) => void
type TrackEvent = (eventName: string, props?: object) => void

interface Props {
  env: Env
  setAppSketchId: SetAppSketchId
  trackEvent?: TrackEvent
}

interface State {
  env: Env
  setAppSketchId: SetAppSketchId
  trackEvent: TrackEvent
}

export const EnvContext = createContext(({} as unknown) as State)

export const EnvProvider: React.FC<Props> = ({
  env,
  setAppSketchId,
  trackEvent,
  children,
}) => {
  console.log({
    NEXT_PUBLIC_PLAUSIBLE_TRACKING: process.env.NEXT_PUBLIC_PLAUSIBLE_TRACKING,
  })
  const value: State = {
    env,
    setAppSketchId,
    trackEvent: (eventName, props) => {
      if (process.env.NEXT_PUBLIC_PLAUSIBLE_TRACKING === 'true') {
        if (trackEvent) trackEvent(eventName, props)
      } else {
        console.info('%cTrack event', 'color: blue', eventName, props)
      }
    },
  }

  return <EnvContext.Provider value={value}>{children}</EnvContext.Provider>
}

interface FilterProps {
  env: Env
}

export const OnlyEnv: React.FC<FilterProps> = ({ children, env: onlyEnv }) => {
  const { env } = useContext(EnvContext)

  if (env !== onlyEnv) return null

  return <>{children}</>
}

export const ExceptEnv: React.FC<FilterProps> = ({
  children,
  env: exceptEnv,
}) => {
  const { env } = useContext(EnvContext)

  if (env === exceptEnv) return null

  return <>{children}</>
}
