export const map = (value, min1, max1, min2, max2, clampResult) => {
  var returnvalue = ((value - min1) / (max1 - min1)) * (max2 - min2) + min2
  if (clampResult) return clamp(returnvalue, min2, max2)
  else return returnvalue
}

export const clamp = (value, min, max) => {
  if (max < min) {
    var temp = min
    min = max
    max = temp
  }

  return Math.max(min, Math.min(value, max))
}

export const roundToDecimalPlace = (num, degree) =>
  Math.round(num * Math.pow(10, degree)) / Math.pow(10, degree)
