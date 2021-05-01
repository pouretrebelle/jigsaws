import { useEffect } from 'react'
import { SketchContent } from 'types'

import { setLocalStorageSeeds } from 'lib/seeds'

export const useSetLocalStorageSeeds = (sketch: SketchContent) => {
  useEffect(() => {
    setLocalStorageSeeds(sketch)
  }, [sketch.id])
}
