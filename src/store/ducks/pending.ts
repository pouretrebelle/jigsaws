import React from 'react'

import { State, ActionType } from 'types'

interface Payload {
  action: ActionType
}

export const reducer: React.Reducer<
  State,
  { type: string; payload: Payload }
> = (state, action) => {
  switch (action.type) {
    case ActionType.AddPending: {
      const pending = [...new Set([...state.pending, action.payload.action])]

      return {
        ...state,
        pending,
      }
    }

    case ActionType.RemovePending: {
      const pending = state.pending.filter(
        (pendingAction: ActionType) => pendingAction !== action.payload.action
      )

      return {
        ...state,
        pending,
      }
    }

    default:
      return state
  }
}

export const addPending = (action: ActionType) => ({
  type: ActionType.AddPending,
  payload: { action },
})

export const removePending = (action: ActionType) => ({
  type: ActionType.RemovePending,
  payload: { action },
})
