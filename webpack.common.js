const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  target: 'web'
, entry: {
    'index': './src/index.tsx'
  }
, output: {
    path: path.join(__dirname, 'dist')
  , filename: '[name].js'
  }
, resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  , plugins: [new TsconfigPathsPlugin()]
  }
, module: {
    rules: [
      {
        test: /\.tsx?$/
      , exclude: /node_module/
      , use: 'ts-loader'
      }
    , {
        test: /\.css$/i
      , use: ['style-loader', 'css-loader']
      }
    ]
  }
, plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })
  , new HtmlWebpackPlugin({
      templateContent: `
        <html>
          <body>
            <div id="root"></div>
          </body>
        </html>
      `
    })
  ]
}
