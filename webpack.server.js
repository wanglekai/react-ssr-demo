const path = require('path')
const baseConfig = require('./webpack.base')
const merge = require('webpack-merge')

const config = {
    target: 'node',
    entry: './src/server/index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    }
}
module.exports = merge(baseConfig, config)
