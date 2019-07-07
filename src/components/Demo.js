import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reaction, observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Controls from './Controls'

const MM_TO_INCH = 0.0393701

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (min-width: 700px) {
    flex-direction: row;
  }
`
const CanvasWrapper = styled.div`
  flex: 1 0 0;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`

const Canvas = styled.canvas`
  width: 90vw;
  height: 90vw;

  @media (min-width: 700px) {
    width: calc(90vmin - 150px);
    height: calc(90vmin - 150px);
  }
`

@inject('store')
@observer
class Demo extends Component {
  designReaction = undefined
  cutReaction = undefined

  canvas = undefined
  designCanvas = undefined
  bleed = undefined
  @observable width = undefined
  bleedWidth = undefined

  constructor(props) {
    super(props)
    const { store } = this.props

    // reach to design seeds
    this.designReaction = reaction(
      () => [...store.designNoiseSeeds],
      () => this.drawDesign()
    )

    // react to cut noise seeds and resizing
    this.cutReaction = reaction(
      () => [...store.cutNoiseSeeds, store.windowWidth, store.windowHeight],
      () => this.drawCanvas(),
      {
        delay: 100,
      }
    )
  }

  componentWillUnmount() {
    this.designReaction()
    this.cutReaction()
  }

  componentDidMount() {
    const { settings, setDesignCanvas } = this.props.store
    const canvas = this.canvas

    const designCanvas = document.createElement('canvas')
    setDesignCanvas(designCanvas)

    this.bleed = Math.round(settings.bleed * MM_TO_INCH * settings.dpi)
    this.width = Math.round(settings.width * MM_TO_INCH * settings.dpi)
    this.bleedWidth = this.width + this.bleed * 2

    canvas.width = this.bleedWidth
    canvas.height = this.bleedWidth

    designCanvas.width = this.bleedWidth
    designCanvas.height = this.bleedWidth

    this.drawDesign()
  }

  drawDesign = () => {
    const { bleed, bleedWidth } = this
    const { design, store } = this.props
    const c = store.designCanvas.getContext('2d')

    design({
      c,
      width: bleedWidth,
      bleed,
      seed: store.designNoiseSeeds,
    })

    // then draw canvas with new design
    this.drawCanvas()
  }

  drawCanvas = () => {
    const { canvas, width, bleed, bleedWidth } = this
    const { cut, store } = this.props

    const c = this.canvas.getContext('2d')
    const pixel = this.bleedWidth / canvas.clientWidth

    c.drawImage(store.designCanvas, 0, 0)

    c.strokeStyle = store.settings.lineColor
    c.lineWidth = pixel

    c.save()
    c.translate(bleed, bleed)
    cut({
      c,
      width,
      seed: store.cutNoiseSeeds,
    })
    c.restore()

    // guides
    c.beginPath()

    c.moveTo(bleed, 0)
    c.lineTo(bleed, bleedWidth)

    c.moveTo(bleedWidth - bleed, 0)
    c.lineTo(bleedWidth - bleed, bleedWidth)

    c.moveTo(0, bleed)
    c.lineTo(bleedWidth, bleed)

    c.moveTo(0, bleedWidth - bleed)
    c.lineTo(bleedWidth, bleedWidth - bleed)

    c.stroke()
  }

  render() {
    const { cut } = this.props
    return (
      <Wrapper>
        <Controls cut={cut} width={this.width} />
        <CanvasWrapper>
          <Canvas ref={(element) => (this.canvas = element)} />
        </CanvasWrapper>
      </Wrapper>
    )
  }
}

Demo.propTypes = {
  design: PropTypes.func,
  cut: PropTypes.func,
  store: PropTypes.object,
}

export default Demo
