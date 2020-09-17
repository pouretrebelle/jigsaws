import React, { useContext } from 'react'
import styled from 'styled-components'

import { SketchContext } from 'Provider'
import {
  toggleVisibility,
  updateSeed,
  exportSketch,
  updateNoiseStart,
} from 'store/actions'
import { Layer, ExportPart, ActionType } from 'types'

import Input from './Input'
import ExportButton from './ExportButton'
import RefreshButton from './RefreshButton'
import ToggleButton from './ToggleButton'
import RangeSlider from './RangeSlider'

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
    noiseStart,
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
            {settings.designNoiseSeeds.map((label, i) => (
              <Input
                key={label}
                layer={Layer.Design}
                index={i}
                label={label}
                value={designNoiseSeeds[i]}
              />
            ))}
          </>
        )}
        <ExportButton
          onClick={() => dispatch(exportSketch(ExportPart.Design))}
          loading={state.pending.includes(ActionType.ExportDesign)}
        >
          Export design
        </ExportButton>

        <RangeSlider
          label="Preview animation frames"
          min={0}
          max={1}
          step={0.004}
          value={noiseStart}
          onChange={(e) => {
            dispatch(updateNoiseStart(Number(e.target.value)))
          }}
        />
        <ExportButton
          onClick={() => dispatch(exportSketch(ExportPart.DesignAnimation))}
          loading={state.pending.includes(ActionType.ExportDesignAnimation)}
        >
          Export animation
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
            {settings.cutNoiseSeeds.map((label, i) => (
              <Input
                key={label}
                layer={Layer.Cut}
                index={i}
                label={label}
                value={cutNoiseSeeds[i]}
              />
            ))}
          </>
        )}
        <ExportButton
          onClick={() => dispatch(exportSketch(ExportPart.Cut))}
          loading={state.pending.includes(ActionType.ExportCut)}
        >
          Export cut
        </ExportButton>
        <ExportButton
          onClick={() => dispatch(exportSketch(ExportPart.cutPieces))}
          loading={state.pending.includes(ActionType.ExportCutPieces)}
        >
          Export cut pieces
        </ExportButton>
      </Section>

      <Section>
        <ExportButton
          onClick={() => dispatch(exportSketch(ExportPart.Canvas))}
          loading={state.pending.includes(ActionType.ExportCanvas)}
        >
          Export canvas
        </ExportButton>
      </Section>
    </>
  )
}

export default Controls
