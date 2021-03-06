export const map = (
  value: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number,
  clampResult?: boolean
): number => {
  const result = ((value - min1) / (max1 - min1)) * (max2 - min2) + min2
  return clampResult ? clamp(result, min2, max2) : result
}

export const clamp = (value: number, min: number, max: number): number => {
  if (max < min) {
    let temp = min
    min = max
    max = temp
  }

  return Math.max(min, Math.min(value, max))
}

export const randomFromNoise = (noiseValue: number): number =>
  Math.abs(noiseValue * 10) % 1

export const signFromRandom = (value: number): number => (value > 0.5 ? 1 : -1)

export const roundToDecimalPlace = (num: number, degree: number): number =>
  Math.round(num * Math.pow(10, degree)) / Math.pow(10, degree)
