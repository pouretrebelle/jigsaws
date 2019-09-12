import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Controls from './Controls'
import Canvas from './Canvas'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (min-width: 700px) {
    flex-direction: row;
  }
`

const CanvasWrapper = styled.div`
  flex: 1 1 0;
  height: 100%;
  overflow: hidden;
  cursor: zoom-in;

  ${({ hovering }) =>
    !hovering &&
    `
      display: flex;
      align-items: center;
      justify-content: center;
  `}
`

const StyledCanvas = styled(Canvas)`
  box-shadow: 0px 0px 100px -50px rgba(0, 0, 0, 0.5);
`

@inject('store')
@observer
class Demo extends Component {
  canvasWrapper = undefined
  @observable mouseX = 0
  @observable mouseY = 0

  onCanvasWrapperRef = (element) => {
    this.props.store.onCanvasMount(element)
  }

  onMouseMoved = ({ pageX, pageY }) => {
    this.mouseX = pageX
    this.mouseY = pageY
  }

  onMouseHover = (bool) => {
    this.props.store.setHovering(bool)
  }

  render() {
    const {
      canvasWrapperBoundingBox,
      canvasWrapperWidth,
      width,
      bleedWidth,
      height,
      bleedHeight,
      hovering,
    } = this.props.store
    const wrapperBox = canvasWrapperBoundingBox

    let canvasWidth = canvasWrapperWidth
    let canvasHeight = canvasWidth * (height / width || 1)

    let x = 0
    let y = 0
    if (hovering) {
      canvasWidth = bleedWidth / (window.devicePixelRatio || 1)
      canvasHeight = bleedHeight / (window.devicePixelRatio || 1)

      const throughX = (this.mouseX - wrapperBox.x) / wrapperBox.width
      const throughY = (this.mouseY - wrapperBox.y) / wrapperBox.height

      x = (canvasWidth - wrapperBox.width) * throughX
      y = (canvasHeight - wrapperBox.height) * throughY
    }

    return (
      <Wrapper>
        <Controls />
        <CanvasWrapper
          ref={this.onCanvasWrapperRef}
          hovering={hovering}
          onMouseEnter={(e) => {
            this.onMouseMoved(e)
            this.onMouseHover(true)
          }}
          onMouseLeave={() => this.onMouseHover(false)}
          onMouseMove={this.onMouseMoved}
        >
          <StyledCanvas
            style={{
              width: canvasWidth,
              height: canvasHeight,
              transform: hovering && `translate(-${x}px, -${y}px)`,
            }}
          />
        </CanvasWrapper>
      </Wrapper>
    )
  }
}

Demo.propTypes = {
  store: PropTypes.object,
}

export default Demo
