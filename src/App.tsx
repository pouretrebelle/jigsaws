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
  constructor(props) {
    super(props)

    const { store, sketch } = this.props

    import(/* webpackChunkName: "[request]" */ `../sketches/${sketch}`).then(
      ({ design, cut, settings }) => {
        store.load({
          settings: Object.assign({ sketch }, settings),
          cut,
          design,
        })
      }
    )
  }

  render() {
    const { sketch, store } = this.props
    return (
      <>
        <Helmet>
          <title>{sketch} (Generative Jigsaws)</title>
        </Helmet>
        <GlobalStyle />
        {store.design && <Demo />}
      </>
    )
  }
}

App.propTypes = {
  sketch: PropTypes.string.isRequired,
  store: PropTypes.object,
}

export default App
