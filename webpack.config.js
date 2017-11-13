'use strict'

const {FLAGS} = require(`./flags`)
const webpack = require(`webpack`)
const HtmlWebpackPlugin = require(`html-webpack-plugin`)
const path = require(`path`)
const {curry, toPairs, map, reduce, pipe} = require(`ramda`)

const merge = curry((a, b) => Object.assign({}, a, b))

const environment = pipe(
  toPairs,
  map(([k, v]) => ({[`process.env.${k}`]: JSON.stringify(v)})),
  reduce(merge, {}),
  merge({
    'CANVAS_RENDERER': JSON.stringify(true),
    'WEBGL_RENDERER': JSON.stringify(true)
  })
)(FLAGS)

console.log(`config!`, JSON.stringify(environment, null, 4))

module.exports = {

  entry: `./src/index.js`,

  output: {
    path: path.resolve(__dirname, `build`),
    filename: `project.bundle.js`
  },

  plugins: [
    new webpack.DefinePlugin(environment),
    new HtmlWebpackPlugin({
      template: `index.html`
    })
  ],
  devServer: {
    port: 3030
  },

  devtool: `inline-source-map`

}
