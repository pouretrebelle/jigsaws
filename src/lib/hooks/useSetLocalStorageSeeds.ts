import { useEffect } from "react"
import { SketchContent } from "types"

export const useSetLocalStorageSeeds = (sketch: SketchContent) => {
  useEffect(() => {
    localStorage.setItem('cutNoiseSeeds', JSON.stringify(sketch.cutNoiseSeeds))
    localStorage.setItem(
      'designNoiseSeeds',
      JSON.stringify(sketch.designNoiseSeeds)
    )
  }, [sketch.id])
}
