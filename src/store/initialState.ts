const getFromStorage = (
  key: string,
  defaultValue: any,
  parseAsJson?: boolean
): any => {
  if (typeof window === 'undefined') return defaultValue
  const value = localStorage[key]
  return value ? (parseAsJson ? JSON.parse(value) : value) : defaultValue
}

const initialState = {
  noiseStart: 0,

  cutVisible: getFromStorage('cutVisible', true, true),
  cutNoiseSeeds: getFromStorage('cutNoiseSeeds', [], true),

  designVisible: getFromStorage('designVisible', true, true),
  designNoiseSeeds: getFromStorage('designNoiseSeeds', [], true),

  pending: [],
  error: undefined,
}

export default initialState
