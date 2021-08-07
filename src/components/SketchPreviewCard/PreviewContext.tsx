import React, { createContext } from 'react'
import { shuffle } from 'shuffle-seed'

import { Cache } from 'types'
import { makeRandomSeed } from 'lib/seeds'

interface Props {
  children: React.ReactNode
  designNoiseSeeds: string[]
  cutNoiseSeeds: string[]
  cache: Cache
}

interface State {
  designCache: Cache['designNoiseSeeds']
  cutCache: Cache['cutNoiseSeeds']
}

interface Context {
  getDesignNoiseSeeds: () => string[]
  getCutNoiseSeeds: () => string[]
}

export const PreviewContext = createContext({} as Context)

export class PreviewProvider extends React.Component<Props> {
  designIndex = 0
  cutIndex = 0
  shuffleSeed = Date.now()

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.designNoiseSeeds.join('') !==
        this.props.designNoiseSeeds.join('') ||
      prevProps.cutNoiseSeeds.join('') !== this.props.cutNoiseSeeds.join('')
    ) {
      this.shuffleSeed = Date.now()
      this.designIndex = 0
      this.cutIndex = 0
    }
  }

  getDesignNoiseSeeds = (): string[] => {
    const { designNoiseSeeds, cache } = this.props

    const designCache = shuffle(cache.designNoiseSeeds, this.shuffleSeed)
    if (!designCache.length) return designNoiseSeeds.map(makeRandomSeed)

    this.designIndex++
    return designCache[this.designIndex % designCache.length].split('-')
  }

  getCutNoiseSeeds = (): string[] => {
    const { cutNoiseSeeds, cache } = this.props

    const cutCache = shuffle(cache.cutNoiseSeeds, this.shuffleSeed)
    if (!cutCache.length) return cutNoiseSeeds.map(makeRandomSeed)

    this.cutIndex++
    return cutCache[this.cutIndex % cutCache.length].split('-')
  }

  render() {
    const { children } = this.props

    return (
      <PreviewContext.Provider
        value={{
          getDesignNoiseSeeds: this.getDesignNoiseSeeds,
          getCutNoiseSeeds: this.getCutNoiseSeeds,
        }}
      >
        {children}
      </PreviewContext.Provider>
    )
  }
}
