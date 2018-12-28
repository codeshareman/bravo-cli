const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = require('../config');

function resolve(dir) {
  return path.join(__dirname, "../../", dir);
}

// 项目名配置

module.exports = {
  mode: "development",
  entry: {
    [config.development.mainEntryKey]: "./src/index.js"
  },
  output: {
    publicPath:  `http://${config.development.host}:9002/`,
    path: resolve('dist'),
    filename: "js/[name].js",
    chunkFilename: "js/[name].js"
  },
  resolve: {
    alias: {
      "@SRC": resolve("src")
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          "css-loader",
          {
            loader: "less-loader",
            options: { javascriptEnabled: true }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        use: [
          {
            loader: "url-loader"
          }
        ]
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 50000,
              name: "./fonts/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  devServer: {
    host: config.development.host,
    historyApiFallback: {
      disabledDotRule: true
    },
    compress: true,
    port: 8888,
    proxy: {
      "/api": {
        target: "http://wws.test.ximalaya.com/wws-b/v2/api/",
        pathRewrite: { "^/api": "" },
        changeOrigin: false,
        secure: false
      },
      "/mock": {
        target: `http://${config.development.host}:3000/`,
        pathRewrite: { "^/mock": "" },
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimization: {
    runtimeChunk: {
      name: config.development.manifestName
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: false
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css"
    }),
    new HtmlWebpackPlugin({
      path: path.resolve(__dirname, "./dist"),
      template: path.resolve(__dirname, "../../", "index.html"),
      filename: "index.html",
      minify: true
    })
  ],
  devtool: "source-map",
  performance: false
};
