import { getFromStorage } from "lib/storage"
import { Env } from "types"

const initialState = {
  env: Env.Dev,

  sketchId: '001',
  sketchIds: ['001'],

  noiseStart: 0,

  cutVisible: getFromStorage('cutVisible', true, true),
  cutNoiseSeeds: getFromStorage('cutNoiseSeeds', [], true),

  designVisible: getFromStorage('designVisible', true, true),
  designNoiseSeeds: getFromStorage('designNoiseSeeds', [], true),

  pending: [],
  error: undefined,
}

export default initialState
