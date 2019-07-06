import React from 'react'
import ReactDOM from 'react-dom'
import AppProvider from './AppProvider'
import 'layouts/favicon.png'

ReactDOM.render(
  <AppProvider sketch={sketch.toString().padStart(3, '0')} />,
  document.getElementById('root')
)

// import './style.sass';
