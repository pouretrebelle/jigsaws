export const getFromStorage = (
  key: string,
  defaultValue: any,
  parseAsJson?: boolean
): any => {
  if (typeof window === 'undefined') return defaultValue
  const value = localStorage[key]
  return value ? (parseAsJson ? JSON.parse(value) : value) : defaultValue
}
