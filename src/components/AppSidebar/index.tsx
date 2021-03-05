import React from 'react'

import { Env, ExceptEnv } from 'env'

import Selector from './Selector'
import Controls from './Controls'
import { AppLinks } from './AppLinks'

export const AppSidebar: React.FC = () => (
  <>
    <ExceptEnv env={Env.Ide}>
      <AppLinks />
    </ExceptEnv>
    <Selector />
    <Controls />
  </>
)
