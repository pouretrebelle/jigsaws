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
  cutNoiseSeeds: 0,
}

class store {
  @observable settings = defaultSettings

  @observable canvasWrapper = undefined
  @observable canvasWrapperBoundingBox = undefined
  @observable canvasWrapperWidth = 500
  @observable hovering = false

  @observable design = undefined
  @observable designVersion = 1
  @observable designNoiseSeeds = []

  @observable canvas = undefined
  @observable designCanvas = undefined
  @observable width = undefined
  @observable bleed = undefined
  @observable bleedWidth = undefined

  @observable cut = undefined
  @observable cutVersion = 1
  @observable cutNoiseSeeds = []

  constructor() {
    if (typeof window !== 'undefined') {
      this.createListeners()
    }
  }

  createListeners() {
    window.addEventListener('resize', this.onWindowResized)
  }

  onWindowResized = () => this.updateDimensions()

  @action
  updateDimensions = () => {
    if (!this.canvasWrapper) return
    const wrapperBox = this.canvasWrapper.getBoundingClientRect()
    this.canvasWrapperWidth =
      Math.min(wrapperBox.width, wrapperBox.height) - 100
    this.canvasWrapperBoundingBox = wrapperBox
  }

  onCanvasMount = (element) => {
    this.canvasWrapper = element
    this.updateDimensions()
  }

  @action
  load = ({ settings, cut, design }) => {
    this.settings = Object.assign(this.settings, settings)

    this.designVersion = localStorage.getItem(`design-${settings.sketch}`) || 1
    this.cutVersion = localStorage.getItem(`cut-${settings.sketch}`) || 1

    this.reseed('design', undefined, true)
    this.reseed('cut', undefined, true)

    this.design = design
    this.cut = cut
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
    this.saveSeed(type, index, value)
  }

  @action
  reseed = (type, index, getFromStorage) => {
    const key = `${type}NoiseSeeds`

    if (index !== undefined) return this.updateSeed(type, index, randomSeed())

    let arr = []
    for (let i = 0; i < this.settings[key]; i++) {
      const value =
        (getFromStorage && localStorage.getItem(`${type}-seed-${i}`)) ||
        randomSeed()
      arr.push(value)
      this.saveSeed(type, i, value)
    }
    this[key] = arr
  }

  @action
  saveSeed = (type, index, value) => {
    localStorage.setItem(`${type}-seed-${index}`, value)
  }

  @action
  setCanvases = (canvas, designCanvas) => {
    this.canvas = canvas
    this.designCanvas = designCanvas
  }

  @action
  setWidths = ({ width, bleedWidth, bleed }) => {
    this.width = width
    this.bleed = bleed
    this.bleedWidth = bleedWidth
  }

  @action
  setHovering = (bool) => {
    this.hovering = bool
  }
}

export default new store()
