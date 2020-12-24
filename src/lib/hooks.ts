import { useState, useEffect } from 'react'

interface WindowSize {
  width: number | null
  height: number | null
}

export const useWindowSize = (): WindowSize => {
  const getSize = (): WindowSize => ({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: null,
    height: null,
  })

  useEffect(() => {
    setWindowSize(getSize())
    const handleResize = (): void => setWindowSize(getSize())

    window.addEventListener('resize', handleResize)
    return (): void => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}
