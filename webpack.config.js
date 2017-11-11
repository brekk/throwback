'use strict'

const {FEATURES} = require(`./features`)
const webpack = require(`webpack`)
const HtmlWebpackPlugin = require(`html-webpack-plugin`)
const path = require(`path`)
const {map} = require(`ramda`)

const JFEATURES = map(JSON.stringify, FEATURES)
console.log(`JFEARTURES`, JFEATURES)
module.exports = {

  entry: `./src/index.js`,

  output: {
    path: path.resolve(__dirname, `build`),
    filename: `project.bundle.js`
  },

  plugins: [
    new webpack.DefinePlugin({
      ...JFEATURES,
      'CANVAS_RENDERER': JSON.stringify(true),
      'WEBGL_RENDERER': JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: `index.html`
    })
  ],
  devServer: {
    port: 3030
  },

  devtool: `inline-source-map`

}
