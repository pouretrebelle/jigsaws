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

type EnumObject = Record<string, any>

const getKeysFromEnum = (enumObject: EnumObject): string[] =>
  Object.keys(enumObject).filter(
    (key) => typeof enumObject[key as any] === 'number'
  )

interface Payload extends Pick<State, 'error'> {
  id: string
  design: any
  cut: any
  settings: SketchConstructorSettings
  DesignNoiseSeeds: EnumObject
  CutNoiseSeeds: EnumObject
}

export const reducer: React.Reducer<
  State,
  { type: string; payload: Payload }
> = (state, action) => {
  switch (action.type) {
    case ActionType.LoadSketch: {
      const {
        id,
        design,
        cut,
        settings,
        DesignNoiseSeeds,
        CutNoiseSeeds,
      } = action.payload

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
        designNoiseSeeds: getKeysFromEnum(DesignNoiseSeeds),
        cutNoiseSeeds: getKeysFromEnum(CutNoiseSeeds),
      } as SketchSettings

      const sketch = { id, design, cut, settings: augmentedSettings }

      const cutNoiseSeedCount = augmentedSettings.cutNoiseSeeds.length
      const cutNoiseSeeds = [
        ...state.cutNoiseSeeds,
        ...makeRandomSeedArray(cutNoiseSeedCount),
      ].slice(0, cutNoiseSeedCount)

      const designNoiseSeedCount = augmentedSettings.designNoiseSeeds.length
      const designNoiseSeeds = [
        ...state.designNoiseSeeds,
        ...makeRandomSeedArray(designNoiseSeedCount),
      ].slice(0, designNoiseSeedCount)

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

  import(/* webpackChunkName: "[request]" */ `../../../sketches/${id}/index.ts`)
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
