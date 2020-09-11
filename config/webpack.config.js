const { readdirSync } = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const sketches = readdirSync('sketches', { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)

module.exports = (env, argv) => ({
  devtool: 'eval-source-map',
  entry: './src/index.tsx',
  node: {
    fs: 'empty',
  },
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
      SKETCH_IDS: JSON.stringify(sketches),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
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
    extensions: ['.tsx', '.ts', '.js'],
  },
})
