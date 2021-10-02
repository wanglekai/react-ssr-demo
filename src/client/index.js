import React from 'react'
import ReactDOM from 'react-dom' 
import routes from '../share/routes'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

ReactDOM.hydrate(
    <BrowserRouter>
        { renderRoutes(routes) }
    </BrowserRouter>, 
    document.getElementById('root')
)
