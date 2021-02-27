import React, { useContext } from 'react'

import { EnvContext } from 'env'
import { Env } from 'types'

export const IdeOnly: React.FC = ({ children }) => {
  const env = useContext(EnvContext)

  if (env !== Env.Ide) return null

  return <>{children}</>
}

export const ExceptIde: React.FC = ({ children }) => {
  const env = useContext(EnvContext)

  if (env === Env.Ide) return null

  return <>{children}</>
}
