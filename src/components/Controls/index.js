import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import saveAs from 'file-saver'
import C2S from 'canvas2svg'
import Input from './Input'
import ExportButton from './ExportButton'
import RefreshButton from './RefreshButton'
import ToggleButton from './ToggleButton'
import {
  formatVersion,
  getCutExportFilename,
  getDesignExportFilename,
  getCanvasExportFilename,
} from 'utils/exportUtils'

const H1 = styled.h1`
  margin: 0 0 0.5rem;
`

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

const Wrapper = styled.aside`
  background: #f8f8f8;
  padding: 1rem;
  min-height: 200px;
  max-height: calc(100vh - 100vw);
  overflow: auto;

  @media (min-width: 700px) {
    width: 150px;
    max-height: 100%;
    padding-right: 1.5rem;
    box-shadow: inset -30px 0 30px -30px rgba(0, 0, 0, 0.1);
  }
`

@inject('store')
@observer
class Controls extends Component {
  onInputChanged = ({ name, index, value }) => {
    this.props.store.updateSeed(name, index, value)
  }

  onInputRefreshed = ({ name, index }) => {
    this.props.store.reseed(name, index)
  }

  onRefreshSeeds = (name) => {
    this.props.store.reseed(name)
  }

  exportDesign = () => {
    const { store } = this.props
    store.designCanvas.toBlob((blob) => {
      saveAs(blob, getDesignExportFilename(store))
    })
    store.incrementVersion('design')
  }

  exportCut = () => {
    const { store } = this.props
    const { cut, width, settings, cutNoiseSeeds } = store

    let svgC = new C2S(width, width)

    cut(
      Object.assign({}, settings, {
        c: svgC,
        width: width,
        seed: cutNoiseSeeds,
      })
    )

    // add outline
    svgC.strokeRect(0, 0, width, width)

    // create blob of svg content
    const blob = new Blob([svgC.getSerializedSvg()], {
      type: 'text/plain',
    })
    saveAs(blob, getCutExportFilename(store))
    store.incrementVersion('cut')
  }

  exportCanvas = () => {
    const { store } = this.props
    store.canvas.toBlob((blob) => {
      saveAs(blob, getCanvasExportFilename(store))
    })
  }

  render() {
    const {
      settings,
      designVisible,
      designVersion,
      designNoiseSeeds,
      cutVisible,
      cutVersion,
      cutNoiseSeeds,
      toggleVisibility,
    } = this.props.store

    return (
      <Wrapper>
        <H1>Sketch {settings.sketch}</H1>

        <Meta>width: {settings.width}mm</Meta>
        <Meta>bleed: {settings.bleed}mm</Meta>
        {settings.rows && <Meta>pieces: {Math.pow(settings.rows, 2)}</Meta>}

        <Section>
          <h2>
            Design
            <ToggleButton
              active={designVisible}
              onClick={() => toggleVisibility('design')}
            />
          </h2>
          {settings.designNoiseSeeds && (
            <>
              <H3>
                Noise seed{settings.designNoiseSeeds > 1 && 's'}{' '}
                <RefreshButton onClick={() => this.onRefreshSeeds('design')} />
              </H3>
              {designNoiseSeeds.map((seed, i) => (
                <Input
                  name="design"
                  index={i}
                  key={i}
                  value={seed}
                  onChange={this.onInputChanged}
                  onRefresh={this.onInputRefreshed}
                />
              ))}
            </>
          )}
          <ExportButton onClick={() => this.exportDesign()}>
            Export ({formatVersion(designVersion)})
          </ExportButton>
        </Section>

        <Section>
          <h2>
            Cut
            <ToggleButton
              active={cutVisible}
              onClick={() => toggleVisibility('cut')}
            />
          </h2>
          {settings.cutNoiseSeeds && (
            <>
              <H3>
                Noise seed{settings.cutNoiseSeeds > 1 && 's'}{' '}
                <RefreshButton onClick={() => this.onRefreshSeeds('cut')} />
              </H3>
              {cutNoiseSeeds.map((seed, i) => (
                <Input
                  name="cut"
                  index={i}
                  key={i}
                  value={seed}
                  onChange={this.onInputChanged}
                  onRefresh={this.onInputRefreshed}
                />
              ))}
            </>
          )}
          <ExportButton onClick={() => this.exportCut()}>
            Export ({formatVersion(cutVersion)})
          </ExportButton>
        </Section>

        <Section>
          <ExportButton onClick={() => this.exportCanvas()}>
            Export canvas
          </ExportButton>
        </Section>
      </Wrapper>
    )
  }
}

Controls.propTypes = {
  store: PropTypes.object,
}

export default Controls
