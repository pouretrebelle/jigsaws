import React from 'react'

import { State, Action, ActionType, ExportPart } from 'types'

import { removePending, addPending, updateNoiseStart } from '../actions'
import {
  exportRaster,
  exportRasterAnimation,
  exportVector,
  exportCanvas,
} from 'lib/export'

const exportActions = {
  [ExportPart.Raster]: {
    actionType: ActionType.ExportRaster,
    exportFunction: exportRaster,
  },
  [ExportPart.RasterAnimation]: {
    actionType: ActionType.ExportRasterAnimation,
    exportFunction: exportRasterAnimation,
  },
  [ExportPart.Vector]: {
    actionType: ActionType.ExportVector,
    exportFunction: exportVector,
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
    if (actionType !== ActionType.ExportVector) {
      dispatch(updateNoiseStart(0))
    }

    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100)
    })

    exportFunction(state)

    dispatch(removePending(actionType))
  }
