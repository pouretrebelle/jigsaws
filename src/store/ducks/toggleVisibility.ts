import React from 'react'

import { State, Layer, ActionType } from '../../types'

interface Payload {
  layer: Layer
}

export const reducer: React.Reducer<State, { type: string; payload: Payload }> =
  (state, action) => {
    if (action.type !== ActionType.ToggleVisibility) return state

    const { layer } = action.payload
    const storeKey = layer === Layer.Vector ? 'vectorVisible' : 'rasterVisible'
    const value = !state[storeKey]

    localStorage.setItem(storeKey, JSON.stringify(value))

    return {
      ...state,
      [storeKey]: value,
    }
  }

export const toggleVisibility = (layer: Layer) => ({
  type: ActionType.ToggleVisibility,
  payload: { layer },
})
