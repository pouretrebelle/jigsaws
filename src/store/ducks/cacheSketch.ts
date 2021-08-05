import React from 'react'

import { State, Action, ActionType, ExportPart } from 'types'

import { removePending, addPending } from '../actions'

const cacheActions = {
  [ExportPart.Design]: {
    actionType: ActionType.CacheDesign,
  },
  [ExportPart.Cut]: {
    actionType: ActionType.CacheCut,
  },
}

export const cacheSketch =
  (part: ExportPart.Design | ExportPart.Cut) =>
  async (dispatch: React.Dispatch<Action>, state: State) => {
    const { actionType } = cacheActions[part]

    if (!actionType) return

    dispatch(addPending(actionType))

    const data: Record<string, string> = {}
    if (part === ExportPart.Design) {
      data.designNoiseSeeds = state.designNoiseSeeds.join('-')
    }
    if (part === ExportPart.Cut) {
      data.cutNoiseSeeds = state.cutNoiseSeeds.join('-')
    }

    const response = await fetch(`/api/cache/${state.sketch?.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const json = await response.json()
    console.log(json)

    dispatch(removePending(actionType))
  }
