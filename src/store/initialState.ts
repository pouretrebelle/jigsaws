const getFromStorage = (
  key: string,
  defaultValue: any,
  parseAsJson?: boolean
): any => {
  const value = localStorage[key]
  return value ? (parseAsJson ? JSON.parse(value) : value) : defaultValue
}

const initialState = {
  initialSketch: getFromStorage('sketch', SKETCH_IDS[0]),

  noiseStart: 0,

  cutVisible: getFromStorage('cutVisible', true, true),
  cutNoiseSeeds: getFromStorage('cutNoiseSeeds', [], true),

  designVisible: getFromStorage('designVisible', true, true),
  designNoiseSeeds: getFromStorage('designNoiseSeeds', [], true),

  pending: [],
  error: undefined,
}

export default initialState
