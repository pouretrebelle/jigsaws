import React, { useRef, useEffect, useState, useContext } from 'react'
import styled from 'styled-components'

import { EnvContext } from 'env'
import { SketchContext } from 'store/Provider'
import { useWindowSize } from 'lib/hooks'
import { drawBackground, drawDesign, drawCut, drawGuides } from 'lib/draw'
import { ActionType } from 'types'
import Loader from 'components/Loader'

const PIXEL_DENSITY =
  typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
const CANVAS_PADDING = 50

interface CanvasWrapperProps {
  $isZooming: boolean
}

const StyledCanvasWrapper = styled.div<CanvasWrapperProps>`
  flex: 1 1 0;
  height: 100%;
  position: relative;
  overflow: hidden;

  ${({ $isZooming }) =>
    !$isZooming &&
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
  const { trackEvent } = useContext(EnvContext)
  const [state] = useContext(SketchContext)
  const {
    sketch,
    noiseStart,
    designVisible,
    cutVisible,
    designNoiseSeeds,
    cutNoiseSeeds,
  } = state

  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const [shouldZoom, setShouldZoom] = useState(false)
  const [isZooming, setIsZooming] = useState(false)
  const [hoverOffset, setHoverOffset] = useState({
    x: 0,
    y: 0,
  })
  const [wrapperBoundingBox, setWrapperBoundingBox] =
    useState<DOMRect | null>(null)
  const [{ width: canvasWidth, height: canvasHeight }, setCanvasDimensions] =
    useState({ width: 0, height: 0 })
  const canvasElement = useRef<HTMLCanvasElement>(null)
  const wrapperElement = useRef<HTMLDivElement>(null)

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

    if (shouldZoom) {
      const width = 2000
      setCanvasSize(width, width * bleedRatio)
      setIsZooming(true)
    } else {
      if (wrapperBoundingBox) {
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
      setIsZooming(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperBoundingBox, shouldZoom, sketch?.id])

  // drawing
  useEffect(() => {
    if (sketch) {
      const canvas = canvasElement.current as HTMLCanvasElement
      const c = canvas.getContext('2d') as CanvasRenderingContext2D
      const { bleedWidth, lineColor } = sketch.settings
      const scale = (canvasWidth / bleedWidth) * PIXEL_DENSITY
      const lineWidth = ((isZooming ? 2 : 1) * PIXEL_DENSITY) / scale

      const drawArgs = {
        canvas,
        c,
        lineWidth,
        state,
      }

      drawBackground(drawArgs)
      c.save()
      c.scale(scale, scale)
      if (designVisible) {
        console.time('design')
        drawDesign(drawArgs)
        console.timeEnd('design')
      }
      c.strokeStyle = lineColor
      if (cutVisible) {
        console.time('cut')
        drawCut(drawArgs)
        console.timeEnd('cut')
      }
      drawGuides(drawArgs)
      c.restore()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canvasWidth,
    canvasHeight,
    noiseStart,
    designVisible,
    cutVisible,
    designNoiseSeeds,
    cutNoiseSeeds,
  ])

  const onMouseMoved = ({ pageX, pageY }: React.MouseEvent) => {
    if (wrapperBoundingBox) {
      const throughX = (pageX - wrapperBoundingBox.x) / wrapperBoundingBox.width
      const throughY =
        (pageY - wrapperBoundingBox.y) / wrapperBoundingBox.height
      setHoverOffset({
        x: (canvasWidth - wrapperBoundingBox.width) * throughX,
        y: (canvasHeight - wrapperBoundingBox.height) * throughY,
      })
    }
  }

  return (
    <StyledCanvasWrapper
      ref={wrapperElement}
      onMouseEnter={onMouseMoved}
      onMouseMove={onMouseMoved}
      $isZooming={isZooming}
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
        onClick={() => {
          setShouldZoom(!shouldZoom)
          trackEvent(`Zoom ${shouldZoom ? 'out' : 'in'}`, { id: sketch?.id })
        }}
        style={{
          width: canvasWidth,
          height: canvasHeight,
          cursor: isZooming ? 'zoom-out' : 'zoom-in',
          transform: isZooming
            ? `translate(-${hoverOffset.x}px, -${hoverOffset.y}px)`
            : undefined,
          backgroundColor: sketch?.settings?.backgroundColor || 'transparent',
        }}
      />
    </StyledCanvasWrapper>
  )
}

export default Canvas
