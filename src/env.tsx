import { createContext } from "react"
import { Env } from "types"

export const EnvContext = createContext<Env>(Env.Prod)
export const EnvProvider: React.FC<{ env: Env }> = ({ env, children }) => (
  <EnvContext.Provider value={env}>{children}</EnvContext.Provider>
)
