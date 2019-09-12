import { observable, action } from 'mobx'

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
  backgroundColor: 'black',
  designNoiseSeeds: 0,
  cutNoiseSeeds: 0,
}

class store {
  @observable settings = defaultSettings

  @observable canvasWrapper = undefined
  @observable canvasWrapperBoundingBox = undefined
  @observable canvasWrapperWidth = 500
  @observable canvasWrapperHeight = 500
  @observable hovering = false

  @observable design = undefined
  @observable designVisible = undefined
  @observable designVersion = 1
  @observable designNoiseSeeds = []

  @observable canvas = undefined
  @observable designCanvas = undefined
  @observable bleed = undefined
  @observable width = undefined
  @observable bleedWidth = undefined
  @observable height = undefined
  @observable bleedHeight = undefined

  @observable cut = undefined
  @observable cutVisible = undefined
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

    const canvasRatio = this.settings.width / this.settings.height
    const verticalMargins = wrapperBox.width / wrapperBox.height > canvasRatio

    let width, height
    if (verticalMargins) {
      height = wrapperBox.height - 100
      width = height * canvasRatio
    } else {
      width = wrapperBox.width - 100
      height = width / canvasRatio
    }

    this.canvasWrapperWidth = width
    this.canvasWrapperHeight = height
    this.canvasWrapperBoundingBox = wrapperBox
  }

  onCanvasMount = (element) => {
    this.canvasWrapper = element
    this.updateDimensions()
  }

  @action
  load = ({ settings, cut, design }) => {
    this.settings = Object.assign(this.settings, settings)

    // square defaults
    this.settings.height = settings.height || settings.width
    this.settings.columns = settings.columns || settings.rows

    this.designVersion = localStorage.getItem(`design-${settings.sketch}`) || 1
    this.designVisible = !!parseInt(localStorage.getItem(`design-visible`))
    this.cutVersion = localStorage.getItem(`cut-${settings.sketch}`) || 1
    this.cutVisible = !!parseInt(localStorage.getItem(`cut-visible`))

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
  setSizing = ({ width, bleedWidth, height, bleedHeight, bleed }) => {
    this.width = width
    this.bleedWidth = bleedWidth
    this.height = height
    this.bleedHeight = bleedHeight
    this.bleed = bleed
  }

  @action
  setHovering = (bool) => {
    this.hovering = bool
  }

  @action
  toggleVisibility = (type) => {
    const bool = !this[`${type}Visible`]
    this[`${type}Visible`] = bool
    localStorage.setItem(`${type}-visible`, bool ? 1 : 0)
  }
}

export default new store()
