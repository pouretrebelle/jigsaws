import { observable, action, toJS } from 'mobx'

const randomSeed = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 3)

const defaultSettings = {
  width: 100, // mm
  bleed: 20, // mm
  dpi: 300,
  lineColor: 'red',
  designNoiseSeeds: 0,
}

class store {
  @observable windowWidth = 0
  @observable windowHeight = 0
  @observable settings = defaultSettings

  @observable designVersion = 1
  @observable designNoiseSeeds = []

  @observable cutVersion = 1
  @observable cutNoiseSeeds = []

  @observable designCanvas = undefined

  constructor() {
    if (typeof window !== 'undefined') {
      this.createListeners()
      this.updateDimensions()
    }
  }

  createListeners() {
    window.addEventListener('resize', this.onWindowResized)
  }

  @action
  updateDimensions = () => {
    this.windowWidth = window.innerWidth
    this.windowHeight = window.innerHeight
  }

  onWindowResized = () => this.updateDimensions()

  @action
  loadSettings = (settings) => {
    this.settings = Object.assign(this.settings, settings)

    this.designVersion = localStorage.getItem(`design-${settings.sketch}`) || 1
    this.cutVersion = localStorage.getItem(`cut-${settings.sketch}`) || 1

    this.reseed('design')
    this.reseed('cut')

    // console.log(toJS(this.settings))
  }

  @action
  incrementVersion = (name) => {
    this[`${name}Version`]++
    localStorage.setItem(
      `${name}-${this.settings.sketch}`,
      this[`${name}Version`]
    )
  }

  @action
  updateSeed = (type, index, value) => {
    this[`${type}NoiseSeeds`][index] = value
  }

  @action
  reseed = (type, index) => {
    const key = `${type}NoiseSeeds`

    if (index !== undefined) return (this[key][index] = randomSeed())

    let arr = []
    for (let i = 0; i < this.settings[key]; i++) {
      arr.push(randomSeed())
    }
    this[key] = arr
  }

  @action
  setDesignCanvas = (canvas) => {
    this.designCanvas = canvas
  }
}

export default new store()
