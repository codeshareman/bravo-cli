const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.config')
const TerserPlugin = require('terser-webpack-plugin')
const CleanWepackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SpeedWebpackPlugin = require('speed-measure-webpack-plugin')
const config = require('../config')
const { resolve } = require('./utils')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    publicPath: config.production.assetsPublicPath,
    path: resolve('dist'),
    filename: 'js/[name].js',
    chunkFilename: config.production.chunkFilename,
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 3,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
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
    new BundleAnalyzerPlugin(),
    new SpeedWebpackPlugin(),
    new webpack.DllReferencePlugin({
      manifest: path.resolve('dll', 'manifest.json'),
    }),
    new CleanWepackPlugin(['dist'], {
      root: resolve('dist'),
    }),
    new CopyWebpackPlugin([
      {
        from: resolve('static'),
        to: 'static',
      },
    ]),
    new webpack.SourceMapDevToolPlugin({
      publicPath: config.sourcemapUrl, // 注意末尾的/
      filename: '[file].map',
    }),
  ],
})
