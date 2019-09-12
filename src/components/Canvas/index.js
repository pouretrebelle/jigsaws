import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reaction } from 'mobx'
import { inject, observer } from 'mobx-react'

const MM_TO_INCH = 0.0393701

@inject('store')
@observer
class Canvas extends Component {
  canvas = undefined
  designReaction = undefined
  cutReaction = undefined
  resizeReaction = undefined

  constructor(props) {
    super(props)
    const { store } = this.props

    // reach to design seeds
    this.designReaction = reaction(
      () => [...store.designNoiseSeeds],
      () => this.drawDesign()
    )

    // react to cut noise seeds, hovering, and visibility
    this.cutReaction = reaction(
      () => [
        ...store.cutNoiseSeeds,
        store.hovering,
        store.designVisible,
        store.cutVisible,
      ],
      () => this.drawCanvas()
    )

    // react to resizing
    this.resizeReaction = reaction(
      () => [store.canvasWrapperBoundingBox],
      () => this.drawCanvas(),
      {
        delay: 100,
      }
    )
  }

  componentWillUnmount() {
    this.designReaction()
    this.cutReaction()
    this.resizeReaction()
  }

  componentDidMount() {
    const { settings, setCanvases, setWidths } = this.props.store
    const canvas = this.canvas

    const designCanvas = document.createElement('canvas')
    setCanvases(canvas, designCanvas)

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
      settings,
    } = this.props.store
    const c = designCanvas.getContext('2d')

    design(
      Object.assign({}, settings, {
        c,
        width: bleedWidth,
        bleed,
        seed: designNoiseSeeds,
      })
    )

    // then draw canvas with new design
    this.drawCanvas()
  }

  drawCanvas = () => {
    const {
      cut,
      cutVisible,
      width,
      bleed,
      bleedWidth,
      canvasWrapperWidth,
      designVisible,
      designCanvas,
      settings,
      cutNoiseSeeds,
      hovering,
    } = this.props.store

    const c = this.canvas.getContext('2d')
    const pixel = hovering
      ? window.devicePixelRatio
      : bleedWidth / canvasWrapperWidth / window.devicePixelRatio

    c.fillStyle = settings.backgroundColor
    c.fillRect(0, 0, width + bleed * 2, width + bleed * 2)

    if (designVisible) c.drawImage(designCanvas, 0, 0)

    c.strokeStyle = settings.lineColor
    c.fillStyle = settings.lineColor
    c.lineWidth = pixel * 2

    if (cutVisible) {
      c.save()
      c.translate(bleed, bleed)
      cut(
        Object.assign({}, settings, {
          c,
          width,
          seed: cutNoiseSeeds,
        })
      )
      c.restore()
    }

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
    return <canvas ref={(element) => (this.canvas = element)} {...this.props} />
  }
}

Canvas.propTypes = {
  store: PropTypes.object,
}

export default Canvas
