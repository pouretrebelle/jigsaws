import { hsl } from 'utils/colorUtils'

const getColor = (hue: number): string => {
  let sat = 100
  let bri = 70
  if (hue < 200 && hue > 40) {
    sat = 80
    bri = 60
  }
  if (hue <= 150) {
    sat = 85
  }
  return hsl(hue, sat, bri)
}

export const BACKGROUND_COLORS = [300, 320, 330].map(getColor)

export const FOREGROUND_COLORS = [
  145, 150, 155, 160, 170, 180, 190, 195, 200, 260, 270, 280,
].map(getColor)
