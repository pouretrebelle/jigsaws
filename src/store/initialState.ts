import { getFromStorage } from "lib/storage"

const initialState = {
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
