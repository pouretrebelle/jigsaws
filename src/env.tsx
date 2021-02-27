import { createContext } from 'react'
import { Env } from 'types'

interface State {
  env: Env
  setAppSketchId: (sketchId: string) => void
}

export const EnvContext = createContext(({} as unknown) as State)

export const EnvProvider: React.FC<State> = ({
  env,
  setAppSketchId,
  children,
}) => (
  <EnvContext.Provider value={{ env, setAppSketchId }}>
    {children}
  </EnvContext.Provider>
)
