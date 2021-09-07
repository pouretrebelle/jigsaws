import React from 'react'

import {
  State,
  Sketch,
  SketchConstructorSettings,
  SketchSettings,
  Action,
  ActionType,
} from 'types'

import { makeRandomSeedArray } from 'lib/seeds'
import { removePending, addPending } from '../actions'

type EnumObject = Record<string, any>

const getKeysFromEnum = (enumObject: EnumObject): string[] =>
  Object.keys(enumObject || {}).filter(
    (key) => typeof enumObject[key as any] === 'number'
  )

interface Payload extends Omit<Sketch, 'settings'>, Pick<State, 'error'> {
  settings: SketchConstructorSettings
  RasterNoiseSeeds: EnumObject
  VectorNoiseSeeds: EnumObject
}

export const reducer: React.Reducer<State, { type: string; payload: Payload }> =
  (state, action) => {
    switch (action.type) {
      case ActionType.LoadSketch: {
        const {
          settings,
          RasterNoiseSeeds,
          VectorNoiseSeeds,
          error,
          id,
          ...rest
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
          rasterNoiseSeeds: getKeysFromEnum(RasterNoiseSeeds),
          vectorNoiseSeeds: getKeysFromEnum(VectorNoiseSeeds),
        } as SketchSettings

        const sketch = {
          id,
          ...rest,
          settings: augmentedSettings,
        }

        const vectorNoiseSeedCount = augmentedSettings.vectorNoiseSeeds.length
        const vectorNoiseSeeds = [
          ...state.vectorNoiseSeeds,
          ...makeRandomSeedArray(vectorNoiseSeedCount),
        ].slice(0, vectorNoiseSeedCount)

        const rasterNoiseSeedCount = augmentedSettings.rasterNoiseSeeds.length
        const rasterNoiseSeeds = [
          ...state.rasterNoiseSeeds,
          ...makeRandomSeedArray(rasterNoiseSeedCount),
        ].slice(0, rasterNoiseSeedCount)

        localStorage.setItem('sketch', id)

        return {
          ...state,
          sketch,
          vectorNoiseSeeds,
          rasterNoiseSeeds,
          rasterVisible: !!sketch.raster,
          vectorVisible: !!sketch.vector,
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

export const loadSketch =
  (id: string) => (dispatch: React.Dispatch<Action>) => {
    dispatch(addPending(ActionType.LoadSketch))

    import(
      /* webpackChunkName: "[request]" */ `../../../sketches/${id}/index.ts`
    )
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
