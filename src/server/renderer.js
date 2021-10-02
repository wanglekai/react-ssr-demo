import React from 'react'
import Home from '../share/pages/Home'
import { renderToString } from 'react-dom/server'

export default function renderer () {
    const content = renderToString(<Home />)

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
