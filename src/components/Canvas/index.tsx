import React, { createRef, useEffect, useState, useContext } from 'react'
import styled from 'styled-components'

import { SketchContext } from 'Provider'
import { useWindowSize } from 'lib/hooks'
import { drawBackground, drawDesign, drawCut, drawGuides } from './draw'
import { ActionType } from 'types'
import Loader from 'components/Loader'

const PIXEL_DENSITY = window.devicePixelRatio || 1
const CANVAS_PADDING = 50

interface CanvasWrapperProps {
  $isHovering: boolean
}

const CanvasWrapper = styled.div<CanvasWrapperProps>`
  flex: 1 1 0;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: zoom-in;

  ${({ $isHovering }) =>
    !$isHovering &&
    `
      display: flex;
      align-items: center;
      justify-content: center;
  `}
`

const StyledCanvas = styled.canvas`
  box-shadow: 0px 0px 100px -50px rgba(0, 0, 0, 0.5);
`

const Canvas: React.FC = () => {
  const [state] = useContext(SketchContext)
  const {
    sketch,
    designVisible,
    cutVisible,
    designNoiseSeeds,
    cutNoiseSeeds,
  } = state

  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const [isHovering, setIsHovering] = useState(false)
  const [hoverOffset, setHoverOffset] = useState({
    x: 0,
    y: 0,
  })
  const [wrapperBoundingBox, setWrapperBoundingBox] = useState<DOMRect>(
    new DOMRect()
  )
  const [
    { width: canvasWidth, height: canvasHeight },
    setCanvasDimensions,
  ] = useState({ width: 0, height: 0 })
  const canvasElement = createRef<HTMLCanvasElement>()
  const wrapperElement = createRef<HTMLDivElement>()

  // drawing
  useEffect(() => {
    if (sketch) {
      const canvas = canvasElement.current as HTMLCanvasElement
      const c = canvas.getContext('2d') as CanvasRenderingContext2D
      const { bleedWidth, lineColor } = sketch.settings
      const scale = (canvasWidth / bleedWidth) * PIXEL_DENSITY
      const lineWidth = ((isHovering ? 2 : 1) * PIXEL_DENSITY) / scale

      const drawArgs = {
        canvas,
        c,
        lineWidth,
        state,
      }

      drawBackground(drawArgs)
      c.save()
      c.scale(scale, scale)
      if (designVisible) drawDesign(drawArgs)
      c.strokeStyle = lineColor
      if (cutVisible) drawCut(drawArgs)
      drawGuides(drawArgs)
      c.restore()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canvasWidth,
    canvasHeight,
    designVisible,
    cutVisible,
    designNoiseSeeds,
    cutNoiseSeeds,
  ])

  // wrapper sizing
  useEffect(() => {
    const ref = wrapperElement.current as HTMLDivElement
    setWrapperBoundingBox(ref.getBoundingClientRect())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth, windowHeight])

  const setCanvasSize = (width: number, height: number) => {
    setCanvasDimensions({ width, height })
    const canvas = canvasElement.current as HTMLCanvasElement
    canvas.width = width * PIXEL_DENSITY
    canvas.height = height * PIXEL_DENSITY
  }

  // canvas sizing
  useEffect(() => {
    const bleedRatio = sketch ? sketch.settings.bleedRatio : 1

    if (isHovering) {
      const width = 2000
      setCanvasSize(width, width * bleedRatio)
    } else {
      const wrapperRatio =
        (wrapperBoundingBox.height - CANVAS_PADDING * 2) /
        (wrapperBoundingBox.width - CANVAS_PADDING * 2)

      if (wrapperRatio > bleedRatio) {
        const width =
          Math.min(wrapperBoundingBox.width, wrapperBoundingBox.height) -
          CANVAS_PADDING * 2
        setCanvasSize(width, width * bleedRatio)
      } else {
        const height =
          Math.min(wrapperBoundingBox.width, wrapperBoundingBox.height) -
          CANVAS_PADDING * 2
        setCanvasSize(height / bleedRatio, height)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperBoundingBox, isHovering])

  const onMouseMoved = ({ pageX, pageY }: React.MouseEvent) => {
    const throughX = (pageX - wrapperBoundingBox.x) / wrapperBoundingBox.width
    const throughY = (pageY - wrapperBoundingBox.y) / wrapperBoundingBox.height
    setHoverOffset({
      x: (canvasWidth - wrapperBoundingBox.width) * throughX,
      y: (canvasHeight - wrapperBoundingBox.height) * throughY,
    })
  }

  return (
    <CanvasWrapper
      ref={wrapperElement}
      onMouseEnter={(e) => {
        onMouseMoved(e)
        setIsHovering(true)
      }}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={onMouseMoved}
      $isHovering={isHovering}
    >
      {state.pending.includes(ActionType.LoadSketch) && (
        <Loader
          style={
            {
              color: sketch?.settings?.lineColor,
              '--size': '3em',
              '--border-width': '3px',
            } as Object
          }
        />
      )}

      <StyledCanvas
        ref={canvasElement}
        style={{
          width: canvasWidth,
          height: canvasHeight,
          transform: isHovering
            ? `translate(-${hoverOffset.x}px, -${hoverOffset.y}px)`
            : undefined,
        }}
      />
    </CanvasWrapper>
  )
}

export default Canvas
