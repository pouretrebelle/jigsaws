import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Input from './Input'
import ExportButton from './ExportButton'
import RefreshButton from './RefreshButton'

const H1 = styled.h1`
  margin: 0 0 0.5rem;
`

const Meta = styled.p`
  font-size: 0.625rem;
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
    console.log('design')
  }

  exportCut = () => {
    console.log('cut')
  }

  render() {
    const { settings, designNoiseSeeds, cutNoiseSeeds } = this.props.store
    return (
      <Wrapper>
        <H1>Sketch {settings.sketch}</H1>

        <Meta>width: {settings.width}mm</Meta>
        <Meta>bleed: {settings.bleed}mm</Meta>
        {settings.rows && <Meta>pieces: {Math.pow(settings.rows, 2)}</Meta>}

        <div>
          <h2>Design</h2>
          <i>iteration ---</i>
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
            Export
          </ExportButton>
        </div>

        <div>
          <h2>Cut</h2>
          <i>iteration ---</i>
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
          <ExportButton onClick={() => this.exportCut()}>Export</ExportButton>
        </div>
      </Wrapper>
    )
  }
}

Controls.propTypes = {
  store: PropTypes.object,
}

export default Controls
