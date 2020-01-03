const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.config');
const config = require('../config');
const { resolve } = require('./utils');
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    publicPath: config.production.assetsPublicPath,
    path: resolve('dist'),
    filename: 'js/[name].js',
    chunkFilename: config.production.chunkFilename,
  },
  plugins: [
    //new BundleAnalyzerPlugin()
    new webpack.SourceMapDevToolPlugin({
      publicPath: config.sourcemapUrl, // 注意末尾的/
      filename: '[name].map',
    }),
  ],
});
