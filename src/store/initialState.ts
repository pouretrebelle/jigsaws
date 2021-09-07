import { getFromStorage } from 'lib/storage'

export const getInitialState = () => ({
  sketchId: '001',
  sketchIds: ['001'],

  noiseStart: 0,

  vectorVisible: getFromStorage('vectorVisible', true, true),
  vectorNoiseSeeds: getFromStorage('vectorNoiseSeeds', [], true),

  rasterVisible: getFromStorage('rasterVisible', true, true),
  rasterNoiseSeeds: getFromStorage('rasterNoiseSeeds', [], true),

  pending: [],
  error: undefined,
})
