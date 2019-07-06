import { observable, action, toJS } from 'mobx';

const randomSeed = () => (Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3))

const defaultSettings = {
  width: 100, // mm
  bleed: 20, // mm
  rows: 10,
  dpi: 300,
  lineColor: 'red',
  designNoiseSeeds: 0,
};

class store {
  @observable windowWidth = 0;
  @observable windowHeight = 0;
  @observable settings = defaultSettings
  @observable cutNoiseSeeds = []
  @observable designNoiseSeeds = []

  constructor() {
    if (typeof window !== 'undefined') {
      this.createListeners();
      this.updateDimensions();
    }
  }

  createListeners() {
    window.addEventListener('resize', this.onWindowResized);
  }

  @action
  updateDimensions = () => {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  };
  
  onWindowResized = () => this.updateDimensions();

  @action
  loadSettings = (settings) => {
    this.settings = Object.assign(this.settings, settings)
  
    this.reseed('design')
    this.reseed('cut')
  
    // console.log(toJS(this.settings))
  }

  @action
  updateSeed = (type, index, value) => {
    this[`${type}NoiseSeeds`][index] = value
  }

  @action
  reseed = (type, index) => {
    const key = `${type}NoiseSeeds`

    if (index !== undefined) return this[key][index] = randomSeed()

    let arr = []
    for (let i = 0; i < this.settings[key]; i++) {
      arr.push(randomSeed())
    }
    this[key] = arr
  }
}

export default new store();
