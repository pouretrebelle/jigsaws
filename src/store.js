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
    this.canvasWrapperBoundingBox = this.canvasWrapper.getBoundingClientRect()
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

    this.reseed('design')
    this.reseed('cut')

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
