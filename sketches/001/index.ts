// export design from './design'
// export cut from './cut'

import designFunc from './design'
import cutFunc from './cut'

export const design = designFunc
export const cut = cutFunc

export const settings = {
  width: 300, // mm
  bleed: 10, // mm
  rows: 20,
  cutNoiseSeeds: 4,
  designNoiseSeeds: 1,
  lineColor: 'white',

  height: 300,
  columns: 20,
  backgroundColor: 'black',
}
