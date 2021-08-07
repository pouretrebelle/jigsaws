import { makeRandomSeed } from 'lib/seeds'
import React, { createContext } from 'react'

interface Props {
  children: React.ReactNode
  designNoiseSeeds: string[]
  cutNoiseSeeds: string[]
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
}: Props) => {
  const getDesignNoiseSeeds = () => sketchDesignNoiseSeeds.map(makeRandomSeed)
  const getCutNoiseSeeds = () => sketchCutNoiseSeeds.map(makeRandomSeed)

  const value = {
    getDesignNoiseSeeds,
    getCutNoiseSeeds,
  }

  return (
    <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
  )
}
