import React from 'react'

import { State, Action, ActionType, ExportPart } from 'types'

import { removePending, addPending, updateNoiseStart } from '../actions'
import {
  exportDesign,
  exportDesignAnimation,
  exportCut,
  exportCutPieces,
  exportCanvas,
} from 'lib/export'

const exportActions = {
  [ExportPart.Design]: {
    actionType: ActionType.ExportDesign,
    exportFunction: exportDesign,
  },
  [ExportPart.DesignAnimation]: {
    actionType: ActionType.ExportDesignAnimation,
    exportFunction: exportDesignAnimation,
  },
  [ExportPart.Cut]: {
    actionType: ActionType.ExportCut,
    exportFunction: exportCut,
  },
  [ExportPart.cutPieces]: {
    actionType: ActionType.ExportCutPieces,
    exportFunction: exportCutPieces,
  },
  [ExportPart.Canvas]: {
    actionType: ActionType.ExportCanvas,
    exportFunction: exportCanvas,
  },
}

export const exportSketch =
  (part: ExportPart) =>
  async (dispatch: React.Dispatch<Action>, state: State) => {
    const { actionType, exportFunction } = exportActions[part]

    if (!actionType) return

    dispatch(addPending(actionType))

    // reset noise start
    if (actionType !== ActionType.ExportCut) {
      dispatch(updateNoiseStart(0))
    }

    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100)
    })

    exportFunction(state)

    dispatch(removePending(actionType))
  }
