import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import GlobalStyle from 'styles/base'
import Demo from 'components/Demo'

@inject('store')
@observer
class App extends Component {
  @observable design = undefined
  @observable cut = undefined

  constructor(props) {
    super(props)

    const { store, sketch } = this.props

    import(/* webpackChunkName: "[request]" */ `../sketches/${sketch}`).then(
      ({ design, cut, settings }) => {
        store.loadSettings(Object.assign({ sketch }, settings))
        this.cut = cut
        this.design = design
      }
    )
  }

  render() {
    const { sketch } = this.props
    return (
      <>
        <Helmet>
          <title>{sketch} (Generative Jigsaws)</title>
        </Helmet>
        <GlobalStyle />
        {this.design && <Demo design={this.design} cut={this.cut} />}
      </>
    )
  }
}

App.propTypes = {
  sketch: PropTypes.string.isRequired,
  store: PropTypes.object,
}

export default App
