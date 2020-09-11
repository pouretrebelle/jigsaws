import React, { useContext } from 'react'
import styled from 'styled-components'

import { SketchContext } from 'Provider'
import { toggleVisibility, updateSeed, exportSketch } from 'store/actions'
import { Layer, ExportPart, ActionType } from 'types'

import Input from './Input'
import ExportButton from './ExportButton'
import RefreshButton from './RefreshButton'
import ToggleButton from './ToggleButton'

const Meta = styled.p`
  font-size: 0.625rem;
`

const Section = styled.section`
  margin: 1.5rem 0 0;
`

const H3 = styled.h3`
  font-size: 0.875rem;
  margin: 0.25rem 0;
`

const Controls = () => {
  const [state, dispatch] = useContext(SketchContext)
  const {
    sketch,
    designVisible,
    designNoiseSeeds,
    cutVisible,
    cutNoiseSeeds,
  } = state

  if (!sketch) return null

  const { settings } = sketch

  return (
    <>
      <Meta>width: {settings.width}mm</Meta>
      <Meta>height: {settings.height}mm</Meta>
      <Meta>bleed: {settings.bleed}mm</Meta>
      <Meta>pieces: {settings.rows * settings.columns}</Meta>

      <Section>
        <h2>
          Design
          <ToggleButton
            active={designVisible}
            onClick={() => dispatch(toggleVisibility(Layer.Design))}
          />
        </h2>
        {designNoiseSeeds.length > 0 && (
          <>
            <H3>
              Noise seed{designNoiseSeeds.length > 1 && 's'}{' '}
              <RefreshButton
                onClick={() => dispatch(updateSeed(Layer.Design))}
              />
            </H3>
            {designNoiseSeeds.map(
              (seed: string, i: number): React.ReactElement => (
                <Input key={seed} layer={Layer.Design} index={i} value={seed} />
              )
            )}
          </>
        )}
        <ExportButton
          onClick={() => dispatch(exportSketch(ExportPart.Design))}
          loading={state.pending.includes(ActionType.ExportDesign)}
        >
          Export design
        </ExportButton>
      </Section>

      <Section>
        <h2>
          Cut
          <ToggleButton
            active={cutVisible}
            onClick={() => dispatch(toggleVisibility(Layer.Cut))}
          />
        </h2>
        {cutNoiseSeeds.length > 0 && (
          <>
            <H3>
              Noise seed{cutNoiseSeeds.length > 1 && 's'}{' '}
              <RefreshButton onClick={() => dispatch(updateSeed(Layer.Cut))} />
            </H3>
            {cutNoiseSeeds.map((seed, i) => (
              <Input key={seed} layer={Layer.Cut} index={i} value={seed} />
            ))}
          </>
        )}
        <ExportButton
          onClick={() => dispatch(exportSketch(ExportPart.Cut))}
          loading={state.pending.includes(ActionType.ExportCut)}
        >
          Export cut
        </ExportButton>
      </Section>

      <Section>
        <ExportButton
          onClick={() => dispatch(exportSketch(ExportPart.Canvas))}
          loading={state.pending.includes(ActionType.ExportCanvas)}
        >
          Export canvas
        </ExportButton>
        <ExportButton
          onClick={() => dispatch(exportSketch(ExportPart.CanvasAnimation))}
          loading={state.pending.includes(ActionType.ExportCanvasAnimation)}
        >
          Export canvas animation
        </ExportButton>
      </Section>
    </>
  )
}

export default Controls
