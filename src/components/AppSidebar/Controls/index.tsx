import React, { useContext } from 'react'
import styled from 'styled-components'
import yaml from 'js-yaml'

import { SketchContext } from 'store/Provider'
import { EnvContext } from 'env'
import { toggleVisibility, updateSeed, exportSketch } from 'store/actions'
import { Layer, ExportPart, ActionType } from 'types'
import { trim } from 'styles/helpers'
import { ShuffleButton } from 'components/ShuffleButton'

import Input from './Input'
import ExportButton from './ExportButton'
import ToggleButton from './ToggleButton'

const Section = styled.section`
  margin: 0 0 1.5rem;
  ${trim}
`

const H3 = styled.h3`
  font-size: 0.875rem;
  margin: 0.25rem 0;
`

const Controls = () => {
  const [state, dispatch] = useContext(SketchContext)
  const { sketch, designVisible, designNoiseSeeds, cutVisible, cutNoiseSeeds } =
    state
  const { trackEvent } = useContext(EnvContext)

  if (!sketch) return null

  const { settings } = sketch

  return (
    <>
      <Section>
        <ExportButton
          onClick={() => {
            dispatch(exportSketch(ExportPart.Canvas))
            trackEvent('Export canvas', { id: sketch?.id })
          }}
          loading={state.pending.includes(ActionType.ExportCanvas)}
          ext="png"
        >
          Export canvas
        </ExportButton>
        <ExportButton
          onClick={() =>
            navigator.clipboard.writeText(
              yaml.dump({ designNoiseSeeds, cutNoiseSeeds }, { flowLevel: 1 })
            )
          }
          ext="yml"
        >
          Copy seeds
        </ExportButton>
      </Section>
      <Section>
        <h2>
          <ToggleButton
            active={designVisible}
            onClick={() => dispatch(toggleVisibility(Layer.Design))}
            title="Toggle design"
          />
          Design
        </h2>
        {designNoiseSeeds.length > 0 && (
          <>
            <H3>
              Noise seed{designNoiseSeeds.length > 1 && 's'}{' '}
              <ShuffleButton
                onClick={() => {
                  dispatch(updateSeed(Layer.Design))
                  trackEvent('Update design seed', {
                    id: sketch?.id,
                    all: true,
                  })
                }}
              />
            </H3>
            {settings.designNoiseSeeds.map((label, i) => (
              <Input
                key={label}
                layer={Layer.Design}
                index={i}
                label={label}
                value={designNoiseSeeds[i]}
                onChange={() =>
                  trackEvent('Update design seed', { id: sketch?.id, label })
                }
              />
            ))}
          </>
        )}
        <ExportButton
          onClick={() => {
            dispatch(exportSketch(ExportPart.Design))
            trackEvent('Export design', { id: sketch?.id })
          }}
          loading={state.pending.includes(ActionType.ExportDesign)}
          ext="png"
        >
          Export design
        </ExportButton>
      </Section>

      <Section>
        <h2>
          <ToggleButton
            active={cutVisible}
            onClick={() => dispatch(toggleVisibility(Layer.Cut))}
            title="Toggle cut"
          />
          Cut
        </h2>
        {cutNoiseSeeds.length > 0 && (
          <>
            <H3>
              Noise seed{cutNoiseSeeds.length > 1 && 's'}{' '}
              <ShuffleButton
                onClick={() => {
                  dispatch(updateSeed(Layer.Cut))
                  trackEvent('Update cut seed', { id: sketch?.id, all: true })
                }}
              />
            </H3>
            {settings.cutNoiseSeeds.map((label, i) => (
              <Input
                key={label}
                layer={Layer.Cut}
                index={i}
                label={label}
                value={cutNoiseSeeds[i]}
                onChange={() =>
                  trackEvent('Update cut seed', { id: sketch?.id, label })
                }
              />
            ))}
          </>
        )}
        <ExportButton
          onClick={() => {
            dispatch(exportSketch(ExportPart.Cut))
            trackEvent('Export cut', { id: sketch?.id, pieces: false })
          }}
          loading={state.pending.includes(ActionType.ExportCut)}
          ext="svg"
        >
          Export cut
        </ExportButton>
        <ExportButton
          onClick={() => {
            dispatch(exportSketch(ExportPart.CutPieces))
            trackEvent('Export cut', { id: sketch?.id, pieces: true })
          }}
          loading={state.pending.includes(ActionType.ExportCutPieces)}
          ext="svg"
        >
          Export cut (pieces)
        </ExportButton>
        <ExportButton
          onClick={() => {
            dispatch(exportSketch(ExportPart.CutWebsite))
            trackEvent('Export cut', { id: sketch?.id, website: true })
          }}
          loading={state.pending.includes(ActionType.ExportCutWebsite)}
          ext="svg"
        >
          Export cut (website)
        </ExportButton>
      </Section>
    </>
  )
}

export default Controls
