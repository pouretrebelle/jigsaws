import React, { createContext, useReducer } from 'react'
import { State, Action, Thunk, AugmentedDispatch } from 'types'
import * as reducers from 'store/reducers'
import initialState from 'store/initialState'

const combinedReducers: React.Reducer<State, Action> = (state, action) =>
  Object.values(reducers).reduce(
    (prevState, reducer) => reducer(prevState, action),
    state
  )

const augmentDispatch = (dispatch: React.Dispatch<Action>, state: State) => (
  input: Thunk | Action
) => (input instanceof Function ? input(dispatch, state) : dispatch(input))

type Context = [State, AugmentedDispatch]
export const SketchContext = createContext(([{}] as unknown) as Context)

const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(combinedReducers, initialState)
  const value = [state, augmentDispatch(dispatch, state)] as Context

  return (
    <SketchContext.Provider value={value}>{children}</SketchContext.Provider>
  )
}

export default Provider
