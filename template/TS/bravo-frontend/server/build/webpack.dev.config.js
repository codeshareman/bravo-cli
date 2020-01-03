const merge = require("webpack-merge");
const common = require("./webpack.common.config");
const utils = require("./utils");
const config = require("../config");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.tsx",
  output: {
    publicPath: `//${utils.getIP()}:${config.port}/`,
    // publicPath: '/',
    path: utils.resolve("dist"),
    filename: "js/[name].js",
    chunkFilename: "js/[name]_[hash:6].js"
  },
  plugins: [],
  devServer: {
    contentBase: utils.resolve("dist"),
    host: utils.getIP(),
    historyApiFallback: {
      disabledDotRule: true
    },
    progress: true,
    hot: false,
    disableHostCheck: true,
    compress: true,
    //color: true,
    port: config.port,
    proxy: {
      "/web": {
        target: "http://passport.test.ximalaya.com/web",
        pathRewrite: { "^/": "/" },
        changeOrigin: true,
        secure: false
      },
      "/portal-provider": {
        target: "http://192.168.136.190:8889/portal-provider",
        pathRewrite: { "^/portal-provider": "/" },
        changeOrigin: true,
        secure: false
      }
    }
  }
});
