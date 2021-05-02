export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - (hours * 3600)) / 60)

  const minuteString = `${minutes}min${minutes > 1 ? 's' : ''}`

  if (!hours) return minuteString
  return `${hours}h ${minuteString}`
}
