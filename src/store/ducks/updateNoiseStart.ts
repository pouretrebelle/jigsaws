import React from 'react'

import { State, ActionType } from '../../types'

interface Payload {
  value: number
}

export const reducer: React.Reducer<State, { type: string; payload: Payload }> =
  (state, action) => {
    if (action.type !== ActionType.UpdateNoiseStart) return state

    return {
      ...state,
      noiseStart: action.payload.value,
    }
  }

export const updateNoiseStart = (value: number) => ({
  type: ActionType.UpdateNoiseStart,
  payload: { value },
})
