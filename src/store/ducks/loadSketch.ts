import React from 'react'

import {
  State,
  SketchConstructorSettings,
  SketchSettings,
  Action,
  ActionType,
} from 'types'

import { makeRandomSeedArray } from 'lib/seeds'
import { removePending, addPending } from '../actions'

interface Payload extends Pick<State, 'error'> {
  id: string
  design: any
  cut: any
  settings: SketchConstructorSettings
}

export const reducer: React.Reducer<
  State,
  { type: string; payload: Payload }
> = (state, action) => {
  switch (action.type) {
    case ActionType.LoadSketch: {
      const { id, design, cut, settings } = action.payload

      const height = settings.height || settings.width
      const bleedWidth = settings.width + settings.bleed * 2
      const bleedHeight = height + settings.bleed * 2
      const augmentedSettings = {
        ...settings,
        bleedWidth,
        bleedHeight,
        bleedRatio: bleedHeight / bleedWidth,
        backgroundColor: settings.backgroundColor || '#000',
        lineColor: settings.lineColor || '#fff',
        height,
        rows: settings.rows || settings.columns,
      } as SketchSettings

      const sketch = { id, design, cut, settings: augmentedSettings }

      const cutNoiseSeeds = [
        ...state.cutNoiseSeeds,
        ...makeRandomSeedArray(settings.cutNoiseSeeds),
      ].slice(0, settings.cutNoiseSeeds)

      const designNoiseSeeds = [
        ...state.designNoiseSeeds,
        ...makeRandomSeedArray(settings.designNoiseSeeds),
      ].slice(0, settings.designNoiseSeeds)

      localStorage.setItem('sketch', id)

      return {
        ...state,
        sketch,
        cutNoiseSeeds,
        designNoiseSeeds,
        loading: false,
      }
    }

    case ActionType.LoadSketchError: {
      return {
        ...state,
        error: action.payload.error,
      }
    }

    default:
      return state
  }
}

export const loadSketch = (id: string) => (
  dispatch: React.Dispatch<Action>
) => {
  dispatch(addPending(ActionType.LoadSketch))

  import(/* webpackChunkName: "[request]" */ `../../../sketches/${id}`)
    .then((res) => {
      dispatch({
        type: ActionType.LoadSketch,
        payload: { id, ...res },
      })
    })
    .catch((error) =>
      dispatch({ type: ActionType.LoadSketchError, payload: { error } })
    )
    .finally(() => dispatch(removePending(ActionType.LoadSketch)))
}
