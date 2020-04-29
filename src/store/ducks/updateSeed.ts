import React from 'react'

import { State, Layer, ActionType } from '../../types'
import { makeRandomSeedArray, makeRandomSeed } from 'utils/seeds'

interface Payload {
  layer: Layer
  index?: number
  value?: string
}

export const reducer: React.Reducer<
  State,
  { type: string; payload: Payload }
> = (state, action) => {
  if (action.type !== ActionType.UpdateSeed) return state

  const { layer, index, value } = action.payload
  const storeKey = layer === Layer.Cut ? 'cutNoiseSeeds' : 'designNoiseSeeds'

  let seeds = [...state[storeKey]]
  if (index !== undefined) {
    seeds[index] = value || makeRandomSeed()
  } else {
    seeds = makeRandomSeedArray(seeds.length)
  }

  localStorage.setItem(storeKey, JSON.stringify(seeds))

  return {
    ...state,
    [storeKey]: seeds,
  }
}

export const updateSeed = (layer: Layer, index?: number, value?: string) => ({
  type: ActionType.UpdateSeed,
  payload: { layer, index, value },
})
