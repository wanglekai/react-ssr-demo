import React from 'react'
import routes from '../share/routes'
import { renderToString } from 'react-dom/server'
import { renderRoutes } from 'react-router-config'
import { StaticRouter } from 'react-router-dom'

export default function renderer (req) {
    const content = renderToString(
        <StaticRouter location={req.path}>
            { renderRoutes(routes) }
        </StaticRouter>)

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div id="root">${content}</div>
        <script src="bundle.js"></script>
    </body>
    </html>
    `
}
