const merge = require('webpack-merge');
const common = require('./webpack.common.config');
const utils = require('./utils');
const config = require('../config');
var HelloWorldPlugin = require('../plugins');

module.exports = merge(common, {
  mode: 'development',
  // devtool: 'source-map',
  entry: './src/index.tsx',
  output: {
    publicPath: `//${utils.getIP()}:${config.port}/`,
    // publicPath: '/',
    path: utils.resolve('dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name]_[hash:6].js',
  },
  plugins: [new HelloWorldPlugin({ options: true })],
  devServer: {
    contentBase: utils.resolve('dist'),
    host: utils.getIP(),
    historyApiFallback: {
      disabledDotRule: true,
    },
    progress: true,
    hot: false,
    disableHostCheck: true,
    compress: true,
    //color: true,
    port: config.port,
    proxy: {
      '/web': {
        target: 'http://passport.test.ximalaya.com/web',
        pathRewrite: { '^/': '/' },
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
