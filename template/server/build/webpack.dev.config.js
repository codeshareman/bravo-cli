
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWepackPlugin = require('clean-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, '../../', dir);
}

module.exports = {
    mode: "development",
    entry: {
        // 'reacts': ['react', 'react-dom', 'react-router-dom', 'react-router', 'redux', 'react-redux', 'redux-saga'],
        'app-broccoli': './src/index.js',
    },
    output: {
        publicPath: '/',
        path: resolve('dist'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js'
    },
    resolve: {
        alias: {
            '@': resolve('src')
        }
    },
    module: {
        rules: 
        [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {}
                    },
                    {
                      loader: 'css-loader',
                      options: {
                        modules: true
                      }
                    }
                ]
                
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {}
                    },
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: { javascriptEnabled: true }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {}
                    },
                    'css-loader',
                    {
                        loader: 'sass-loader',
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
                        loader: 'url-loader',
                    }
                ],
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 50000,
                            name: './fonts/[name].[ext]',
                        }
                    }
                ]
            }   
        ]
    },
    devServer: {
        // contentBase: path.join(__dirname, './'),
        historyApiFallback: {
            disabledDotRule: true
        },
        compress: true,
        port: 9002,
        proxy: {
            '/api': {
                target: 'https://api.apiopen.top/',
                pathRewrite: {"^/api" : ""},
                changeOrigin: true,
                secure: true
            },
            '/taobao': {
                target: 'http://tcc.taobao.com/cc/json/',
                pathRewrite: { "^/taobao": ""},
                changeOrigin: true,
                secure: false
            }
        }
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest-broccoli'
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
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: true,
                    },
                },
                // Use multi-process parallel running to improve the build speed
                // Default number of concurrent runs: os.cpus().length - 1
                parallel: true,
                // Enable file caching
                cache: true,
                sourceMap: false,
            })
        ],
    },
    plugins: [
        // new webpack.NamedModulesPlugin(),
        // new webpack.NamedChunksPlugin(),
        new  webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, '../../', 'dll/reacts.manifest.json'),
        }),
        new  webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, '../../', 'dll/biz_charts.manifest.json'),
        }),
        new  webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, '../../', 'dll/ant_icon.manifest.json'),
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].css'
        }),
        new HtmlWebpackPlugin({
            path: path.resolve(__dirname, './dist'),
            template: path.resolve(__dirname, '../../', 'index.html'),
            filename: 'index.html',
            minify: true
        })
    ],
    devtool: 'source-map',
    performance: false

}