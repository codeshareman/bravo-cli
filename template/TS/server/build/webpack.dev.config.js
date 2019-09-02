/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-16 06:03:07
 * @LastEditTime: 2019-08-19 15:48:10
 * @LastEditors: Please set LastEditors
 */
const merge = require("webpack-merge");
const common = require("./webpack.common.config");
const { resolve } = require("../config/func");
const config = require("../config");

module.exports = merge(common, {
  mode: "development",
  devtool: "cheap-eval-source-map",
  entry: {
    [config.development.mainEntryKey]: "./src/index.tsx"
  },
  output: {
    publicPath: `http://${config.development.host}:9001/`,
    //publicPath:config.development.assetsPublicPath,
    // publicPath: "/",
    path: resolve("dist"),
    filename: "js/[name].js",
    chunkFilename: "js/[name].js"
  },
  optimization: {
    runtimeChunk: {
      name: config.development.manifestName
    },
    splitChunks: {
      chunks: "async",
      minSize: 100000,
      minChunks: 1,
      maxAsyncRequests: 19,
      maxInitialRequests: 19,
      automaticNameDelimiter: "~",
      name: false
    }
  },
  devServer: {
    contentBase: resolve("dist"),
    host: config.development.host,
    historyApiFallback: {
      disabledDotRule: true
    },
    hot: false,
    disableHostCheck: true,
    compress: true,
    port: 9001,
    proxy: {
      "/wws-dashboard": {
        target: "http://wws.test.ximalaya.com/wws-dashboard",
        pathRewrite: { "^/wws-scan-play": "" },
        changeOrigin: true,
      }
      // "/wws-scan-play": {
      //   target: "http://192.168.1.3:3000/wws-scan-play",
      //   pathRewrite: { "^/wws-scan-play": "" },
      //   changeOrigin: true,
      //   secure: false
      // }
      // "/": {
      //   target: "http://172.31.24.231:8081/wws-library-web",
      //   pathRewrite: { "^/": "" },
      //   changeOrigin: true,
      //   secure: false
      // }
    }
  }
});
