const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.config');
const { resolve } = require('./utils');
const config = require('../config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    publicPath: config.uat.assetsPublicPath,
    path: resolve('dist'),
    filename: 'js/[name].js',
    chunkFilename: config.uat.chunkFilename,
  },
  plugins: [
    //new BundleAnalyzerPlugin()
    new webpack.SourceMapDevToolPlugin({
      publicPath: config.sourcemapUrl, // 注意末尾的/
      filename: '[name].map',
    }),
  ],
});
