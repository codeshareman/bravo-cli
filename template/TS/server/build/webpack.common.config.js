/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-16 06:03:07
 * @LastEditTime: 2019-08-30 15:42:32
 * @LastEditors: Please set LastEditors
 */
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWepackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const tsImportPluginFactory = require("ts-import-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { resolve } = require("../config/func");
const config = require("../config");

// 项目名配置
module.exports = {
  entry: {
    main: "./src/index.tsx"
  },
  resolve: {
    alias: {
      "@": resolve("src"),
      //antd icon 优化
      "@ant-design/icons/lib/dist$": resolve("src/assets/icons/index")
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [
                  tsImportPluginFactory({
                    libraryName: "antd",
                    libraryDirectory: "lib",
                    style: true
                  })
                ]
              }),
              compilerOptions: {
                module: "es2015"
              }
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     minimize: true
          //   }
          // },
          { loader: "style-loader" },
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
          "css-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
              modifyVars: config.cssModifyVars
            }
          }
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     minimize: true
          //   }
          // }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {}
          // },
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
            loader: "url-loader",
            options: {
              limit: 20 * 1024, //20kb 以上的图片不打包
              name: "images/[hash:18].[ext]"
            }
          }
        ],
        exclude: /node_modules/
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
        ],
        exclude: /node_modules/
      }
    ]
  },

  optimization: {
    runtimeChunk: {
      name: config.production.manifestName
    },
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 8,
      maxInitialRequests: 5,
      automaticNameDelimiter: "~",
      name: true
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
    new webpack.NamedChunksPlugin(),
    new webpack.NamedModulesPlugin(),
    new CleanWepackPlugin(["dist"], {
      root: resolve("")
    }),
    new CopyWebpackPlugin([
      {
        from: resolve("static"),
        to: "static"
      }
    ]),
    new MiniCssExtractPlugin({
      filename: "css/[name].css?v=[hash:8]",
      chunkFilename: "css/[name].css?v=[hash:8]"
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css\.*(?!.*map)/g, //注意不要写成 /\.css$/g
      cssProcessor: require("cssnano"),
      cssProcessorOptions: {
        discardComments: { removeAll: true },
        // 避免 cssnano 重新计算 z-index
        safe: true
      },
      canPrint: true
    }),
    new HtmlWebpackPlugin({
      path: resolve("dist"),
      template: resolve("index.html"),
      filename: "index.html",
      chunksSortMode: "none",
      minify: true
    }),
    //去除moment中除去中文之外的其他语言
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    new webpack.ContextReplacementPlugin(/validatorjs(\/src\/)lang$/, /zh.js$/)
  ],
  performance: false
};
