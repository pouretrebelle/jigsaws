import React, { createContext, useReducer } from 'react'
import { State, Action, Thunk, AugmentedDispatch, Env } from 'types'
import * as reducers from 'store/reducers'
import { getInitialState } from 'store/initialState'

const combinedReducers: React.Reducer<State, Action> = (state, action) =>
  Object.values(reducers).reduce(
    (prevState, reducer) => reducer(prevState, action),
    state
  )

const augmentDispatch = (dispatch: React.Dispatch<Action>, state: State) => (
  input: Thunk | Action
) => (input instanceof Function ? input(dispatch, state) : dispatch(input))

interface Props {
  sketchId: string
  sketchIds: string[]
}

type Context = [State, AugmentedDispatch]
export const SketchContext = createContext(([{}] as unknown) as Context)

const Provider: React.FC<Props> = ({ children, sketchId, sketchIds }) => {
  const [state, dispatch] = useReducer(combinedReducers, getInitialState())

  const value = [
    {
      ...state,
      sketchId,
      sketchIds,
    },
    augmentDispatch(dispatch, state),
  ] as Context

  return (
    <SketchContext.Provider value={value}>{children}</SketchContext.Provider>
  )
}

export default Provider
