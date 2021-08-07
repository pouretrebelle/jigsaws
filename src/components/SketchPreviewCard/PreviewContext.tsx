import React, { createContext, useEffect, useState } from 'react'
import { shuffle } from 'shuffle-seed'

import { Cache } from 'types'
import { makeRandomSeed } from 'lib/seeds'

interface Props {
  children: React.ReactNode
  designNoiseSeeds: string[]
  cutNoiseSeeds: string[]
  cache: Cache
}

interface Context {
  getDesignNoiseSeeds: () => string[]
  getCutNoiseSeeds: () => string[]
}

export const PreviewContext = createContext({} as Context)

export const PreviewProvider = ({
  children,
  designNoiseSeeds: sketchDesignNoiseSeeds,
  cutNoiseSeeds: sketchCutNoiseSeeds,
  cache,
}: Props) => {
  const [designIndex, setDesignIndex] = useState(0)
  const [cutIndex, setCutIndex] = useState(0)

  const shuffleSeed = 'abc'
  const designCache = shuffle(cache?.designNoiseSeeds, shuffleSeed)
  const cutCache = shuffle(cache?.cutNoiseSeeds, shuffleSeed)

  useEffect(() => {
    setDesignIndex(0)
    setCutIndex(0)
  }, [cache])

  const getDesignNoiseSeeds = () => {
    if (!designCache.length) return sketchDesignNoiseSeeds.map(makeRandomSeed)
    setDesignIndex(designIndex + 1)
    return designCache[designIndex % designCache.length].split('-')
  }
  const getCutNoiseSeeds = () => {
    if (!cutCache.length) return sketchCutNoiseSeeds.map(makeRandomSeed)
    setCutIndex(cutIndex + 1)
    return cutCache[cutIndex % cutCache.length].split('-')
  }

  const value = {
    getDesignNoiseSeeds,
    getCutNoiseSeeds,
  }

  return (
    <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
  )
}
