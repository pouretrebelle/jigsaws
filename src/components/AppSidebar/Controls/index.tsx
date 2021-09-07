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
  const {
    sketch,
    rasterVisible,
    rasterNoiseSeeds,
    vectorVisible,
    vectorNoiseSeeds,
  } = state
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
              yaml.dump(
                { rasterNoiseSeeds, vectorNoiseSeeds },
                { flowLevel: 1 }
              )
            )
          }
          ext="yml"
        >
          Copy seeds
        </ExportButton>
      </Section>

      {rasterNoiseSeeds.length > 0 && (
        <Section>
          {vectorNoiseSeeds.length > 0 && (
            <h2>
              <ToggleButton
                active={rasterVisible}
                onClick={() => dispatch(toggleVisibility(Layer.Raster))}
                title="Toggle raster"
              />
              Raster
            </h2>
          )}
          <H3>
            Noise seed{rasterNoiseSeeds.length > 1 && 's'}{' '}
            <ShuffleButton
              onClick={() => {
                dispatch(updateSeed(Layer.Raster))
                trackEvent('Update raster seed', {
                  id: sketch?.id,
                  all: true,
                })
              }}
            />
          </H3>
          {settings.rasterNoiseSeeds.map((label, i) => (
            <Input
              key={label}
              layer={Layer.Raster}
              index={i}
              label={label}
              value={rasterNoiseSeeds[i]}
              onChange={() =>
                trackEvent('Update raster seed', { id: sketch?.id, label })
              }
            />
          ))}
          <ExportButton
            onClick={() => {
              dispatch(exportSketch(ExportPart.Raster))
              trackEvent('Export raster', { id: sketch?.id })
            }}
            loading={state.pending.includes(ActionType.ExportRaster)}
            ext="png"
          >
            Export raster
          </ExportButton>
        </Section>
      )}

      {vectorNoiseSeeds.length > 0 && (
        <Section>
          {rasterNoiseSeeds.length > 0 && (
            <h2>
              <ToggleButton
                active={vectorVisible}
                onClick={() => dispatch(toggleVisibility(Layer.Vector))}
                title="Toggle vector"
              />
              Vector
            </h2>
          )}
          <H3>
            Noise seed{vectorNoiseSeeds.length > 1 && 's'}{' '}
            <ShuffleButton
              onClick={() => {
                dispatch(updateSeed(Layer.Vector))
                trackEvent('Update vector seed', {
                  id: sketch?.id,
                  all: true,
                })
              }}
            />
          </H3>
          {settings.vectorNoiseSeeds.map((label, i) => (
            <Input
              key={label}
              layer={Layer.Vector}
              index={i}
              label={label}
              value={vectorNoiseSeeds[i]}
              onChange={() =>
                trackEvent('Update vector seed', { id: sketch?.id, label })
              }
            />
          ))}
          <ExportButton
            onClick={() => {
              dispatch(exportSketch(ExportPart.Vector))
              trackEvent('Export vector', { id: sketch?.id, pieces: false })
            }}
            loading={state.pending.includes(ActionType.ExportVector)}
            ext="svg"
          >
            Export vector
          </ExportButton>
        </Section>
      )}
    </>
  )
}

export default Controls
