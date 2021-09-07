const { readdirSync } = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const sketches = readdirSync('sketches', { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .reverse()

module.exports = (env, argv) => ({
  devtool: 'eval-source-map',
  entry: './src/App.tsx',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/layout.pug',
      inject: 'body',
    }),
    new webpack.DefinePlugin({
      SKETCH_IDS: JSON.stringify(sketches),
    }),
  ],
  devServer: {
    port: 4001,
  },
  node: {
    fs: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: './.babelrc',
            },
          },
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                noEmit: false,
              },
            },
          },
        ],
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
    modules: ['src', 'node_modules', 'utils'],
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      utils: path.resolve(__dirname, 'utils'),
    },
  },
})
