'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

require('dotenv').config()
const sketchNumber = process.env.SKETCH

module.exports = (env, argv) => ({
  devtool: 'eval-source-map',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '../docs/'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/layouts/main.pug',
      inject: 'body',
    }),
    new webpack.DefinePlugin({
      sketch: JSON.stringify(sketchNumber),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.pug?$/,
        use: [
          'html-loader',
          {
            loader: 'pug-html-loader',
          },
        ],
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['src', 'node_modules'],
  },
})
