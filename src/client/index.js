import React from 'react'
import ReactDOM from 'react-dom' 
import routes from '../share/routes'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { Provider } from 'react-redux'
import store from './createStore'

ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            { renderRoutes(routes) }
        </BrowserRouter>
    </Provider>, 
    document.getElementById('root')
)
