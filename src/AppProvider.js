import React from 'react'
import { Provider } from 'mobx-react'

import store from './store'
import App from './App'

const AppProvider = (props) => (
  <Provider store={store}>
    <App {...props} />
  </Provider>
)

export default AppProvider
