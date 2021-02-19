import React, { useContext } from 'react'

import { SketchContext } from 'Provider'
import { Env } from 'types'

export const IdeOnly: React.FC = ({ children }) => {
  const [{ env }] = useContext(SketchContext)

  if (env !== Env.Ide) return null

  return <>{children}</>
}
