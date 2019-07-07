import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reaction, observable } from 'mobx'
import { inject, observer } from 'mobx-react'

const MM_TO_INCH = 0.0393701

@inject('store')
@observer
class Canvas extends Component {
  designReaction = undefined
  cutReaction = undefined
  canvas = undefined

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
      () => [
        ...store.cutNoiseSeeds,
        store.canvasWrapperBoundingBox,
        store.hovering,
      ],
      () => this.drawCanvas(),
      {
        delay: 1,
      }
    )
  }

  componentWillUnmount() {
    this.designReaction()
    this.cutReaction()
  }

  componentDidMount() {
    const { settings, setDesignCanvas, setWidths } = this.props.store
    const canvas = this.canvas

    const designCanvas = document.createElement('canvas')
    setDesignCanvas(designCanvas)

    const bleed = Math.round(settings.bleed * MM_TO_INCH * settings.dpi)
    const width = Math.round(settings.width * MM_TO_INCH * settings.dpi)
    const bleedWidth = width + bleed * 2

    canvas.width = bleedWidth
    canvas.height = bleedWidth

    designCanvas.width = bleedWidth
    designCanvas.height = bleedWidth

    setWidths({ width, bleedWidth, bleed })

    this.drawDesign()
  }

  drawDesign = () => {
    const {
      design,
      bleed,
      bleedWidth,
      designCanvas,
      designNoiseSeeds,
    } = this.props.store
    const c = designCanvas.getContext('2d')

    design({
      c,
      width: bleedWidth,
      bleed,
      seed: designNoiseSeeds,
    })

    // then draw canvas with new design
    this.drawCanvas()
  }

  drawCanvas = () => {
    const { canvas } = this
    const {
      cut,
      width,
      bleed,
      bleedWidth,
      designCanvas,
      settings,
      cutNoiseSeeds,
    } = this.props.store

    const c = this.canvas.getContext('2d')
    const pixel = bleedWidth / canvas.clientWidth

    c.drawImage(designCanvas, 0, 0)

    c.strokeStyle = settings.lineColor
    c.lineWidth = pixel

    c.save()
    c.translate(bleed, bleed)
    cut({
      c,
      width,
      seed: cutNoiseSeeds,
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
    const { store, ...props } = this.props
    return <canvas ref={(element) => (this.canvas = element)} {...props} />
  }
}

Canvas.propTypes = {
  store: PropTypes.object,
}

export default Canvas
