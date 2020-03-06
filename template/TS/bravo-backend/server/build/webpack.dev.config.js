const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const merge = require('webpack-merge')
const common = require('./webpack.common.config')
const utils = require('./utils')
const config = require('../config')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval',
  entry: './src/index.tsx',
  output: {
    publicPath: `//${utils.getIP()}:${config.port}/`,
    path: utils.resolve('dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name]_[hash:6].js',
  },
  devServer: {
    contentBase: utils.resolve('dist'),
    host: utils.getIP(),
    disableHostCheck: true,
    compress: true,
    hot: true,
    https: true,
    quiet: true,
    port: config.port,
    historyApiFallback: {
      disabledDotRule: true,
    },
  },
  plugins: [new ProgressBarPlugin()],
})
