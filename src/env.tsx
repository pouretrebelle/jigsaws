import { createContext } from 'react'
import { Env } from 'types'

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
