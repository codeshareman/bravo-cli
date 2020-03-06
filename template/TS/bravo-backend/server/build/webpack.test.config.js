const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.config')
const TerserPlugin = require('terser-webpack-plugin')
const CleanWepackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const SpeedWebpackPlugin = require('speed-measure-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { resolve } = require('./utils')
const config = require('../config')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    publicPath: config.test.assetsPublicPath,
    path: resolve('dist'),
    filename: 'js/[name].js',
    chunkFilename: config.test.chunkFilename,
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 8,
      maxInitialRequests: 5,
      automaticNameDelimiter: '~',
      name: true,
    },

    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: false,
      }),
    ],
  },
  plugins: [
    // new SpeedWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    // new webpack.DllReferencePlugin({
    //   manifest: path.resolve('dll', 'manifest.json'),
    // }),
    new CleanWepackPlugin(['dist'], {
      root: resolve('dist'),
    }),
    new CopyWebpackPlugin([
      {
        from: resolve('static'),
        to: 'static',
      },
    ]),
  ],
})
