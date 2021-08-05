import React, { useContext } from 'react'
import styled from 'styled-components'
import yaml from 'js-yaml'

import { SketchContext } from 'store/Provider'
import { Env, EnvContext, ExceptEnv, OnlyEnv } from 'env'
import {
  toggleVisibility,
  updateSeed,
  cacheSketch,
  exportSketch,
  updateNoiseStart,
} from 'store/actions'
import { Layer, ExportPart, ActionType } from 'types'
import { trim } from 'styles/helpers'
import { ShuffleButton } from 'components/ShuffleButton'

import Input from './Input'
import ExportButton from './ExportButton'
import ToggleButton from './ToggleButton'
import RangeSlider from './RangeSlider'
import { BuyPrintsButton } from '../BuyPrintsButton'

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
  const {
    sketch,
    noiseStart,
    designVisible,
    designNoiseSeeds,
    cutVisible,
    cutNoiseSeeds,
  } = state
  const { trackEvent } = useContext(EnvContext)

  if (!sketch) return null

  const { settings } = sketch

  return (
    <>
      <Section>
        <ExceptEnv env={Env.Ide}>
          <BuyPrintsButton />
        </ExceptEnv>
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
        <ExceptEnv env={Env.Prod}>
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
        </ExceptEnv>
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
        <OnlyEnv env={Env.Dev}>
          <ExportButton
            onClick={() => {
              dispatch(cacheSketch(ExportPart.Design))
              trackEvent('Cache design', { id: sketch?.id })
            }}
            loading={state.pending.includes(ActionType.CacheDesign)}
            ext="png"
          >
            Cache design
          </ExportButton>
        </OnlyEnv>

        <OnlyEnv env={Env.Ide}>
          <RangeSlider
            label="Preview animation frames"
            min={0}
            max={1}
            step={0.004}
            value={noiseStart}
            onChange={(e) => {
              dispatch(updateNoiseStart(Number(e.target.value)))
              trackEvent('Export animation', { id: sketch?.id })
            }}
          />
          <ExportButton
            onClick={() => dispatch(exportSketch(ExportPart.DesignAnimation))}
            loading={state.pending.includes(ActionType.ExportDesignAnimation)}
            ext="webm"
          >
            Export animation
          </ExportButton>
        </OnlyEnv>
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
        <OnlyEnv env={Env.Ide}>
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
        </OnlyEnv>
        <OnlyEnv env={Env.Dev}>
          <ExportButton
            onClick={() => {
              dispatch(cacheSketch(ExportPart.Cut))
              trackEvent('Cache cut', { id: sketch?.id })
            }}
            loading={state.pending.includes(ActionType.CacheCut)}
            ext="svg"
          >
            Cache cut
          </ExportButton>
        </OnlyEnv>
      </Section>
    </>
  )
}

export default Controls
