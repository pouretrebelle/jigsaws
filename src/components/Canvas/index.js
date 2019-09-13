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
    const { settings, setCanvases, setSizing } = this.props.store
    const canvas = this.canvas

    const designCanvas = document.createElement('canvas')
    setCanvases(canvas, designCanvas)

    const bleed = Math.round(settings.bleed * MM_TO_INCH * settings.dpi)
    const width = Math.round(settings.width * MM_TO_INCH * settings.dpi)
    const height = Math.round(settings.height * MM_TO_INCH * settings.dpi)
    const bleedWidth = width + bleed * 2
    const bleedHeight = height + bleed * 2

    canvas.width = bleedWidth
    canvas.height = bleedHeight

    designCanvas.width = bleedWidth
    designCanvas.height = bleedHeight

    setSizing({ width, bleedWidth, height, bleedHeight, bleed })

    this.drawDesign()
  }

  drawDesign = () => {
    const {
      design,
      width,
      bleedWidth,
      bleedHeight,
      bleed,
      designCanvas,
      designNoiseSeeds,
      settings,
    } = this.props.store
    const c = designCanvas.getContext('2d')
    c.clearRect(0, 0, bleedWidth, bleedHeight)

    const scale = width / settings.width
    c.save()
    c.scale(scale, scale)

    design(
      Object.assign({}, settings, {
        c,
        width: settings.width + settings.bleed * 2,
        height: settings.height + settings.bleed * 2,
        bleed: settings.bleed,
        seed: designNoiseSeeds,
      })
    )

    c.restore()

    // then draw canvas with new design
    this.drawCanvas()

    // guides
    c.strokeStyle = settings.lineColor
    c.lineWidth = 0.2 * scale // 0.2mm
    c.beginPath()

    // top left
    c.moveTo(bleed, 0)
    c.lineTo(bleed, bleed / 2)
    c.moveTo(0, bleed)
    c.lineTo(bleed / 2, bleed)

    // top right
    c.moveTo(bleedWidth - bleed, 0)
    c.lineTo(bleedWidth - bleed, bleed / 2)
    c.moveTo(bleedWidth - bleed / 2, bleed)
    c.lineTo(bleedWidth, bleed)

    // bottom left
    c.moveTo(0, bleedHeight - bleed)
    c.lineTo(bleed / 2, bleedHeight - bleed)
    c.moveTo(bleed, bleedHeight)
    c.lineTo(bleed, bleedHeight - bleed / 2)

    // bottom right
    c.moveTo(bleedWidth - bleed, bleedHeight)
    c.lineTo(bleedWidth - bleed, bleedHeight - bleed / 2)
    c.moveTo(bleedWidth - bleed / 2, bleedHeight - bleed)
    c.lineTo(bleedWidth, bleedHeight - bleed)

    c.stroke()
  }

  drawCanvas = () => {
    const {
      cut,
      cutVisible,
      bleed,
      width,
      bleedWidth,
      height,
      bleedHeight,
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
    c.fillRect(0, 0, bleedWidth, bleedHeight)

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
          height,
          seed: cutNoiseSeeds,
        })
      )

      // outline
      c.strokeRect(0, 0, width, height)
      c.restore()
    }
  }

  render() {
    const { store, ...props } = this.props // eslint-disable-line no-unused-vars
    return <canvas ref={(element) => (this.canvas = element)} {...props} />
  }
}

Canvas.propTypes = {
  store: PropTypes.object,
}

export default Canvas
