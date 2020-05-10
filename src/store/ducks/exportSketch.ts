import React from 'react'

import { State, Action, ActionType, ExportPart } from 'types'

import { removePending, addPending } from '../actions'
import { exportCut, exportDesign, exportCanvas } from 'lib/export'

const exportActions = {
  [ExportPart.Cut]: {
    actionType: ActionType.ExportCut,
    exportFunction: exportCut,
  },
  [ExportPart.Design]: {
    actionType: ActionType.ExportDesign,
    exportFunction: exportDesign,
  },
  [ExportPart.Canvas]: {
    actionType: ActionType.ExportCanvas,
    exportFunction: exportCanvas,
  },
}

export const exportSketch = (part: ExportPart) => async (
  dispatch: React.Dispatch<Action>,
  state: State
) => {
  const { actionType, exportFunction } = exportActions[part]

  if (!actionType) return

  dispatch(addPending(actionType))

  await new Promise((resolve) => {
    setTimeout(() => resolve(), 100)
  })

  exportFunction(state)

  dispatch(removePending(actionType))
}
