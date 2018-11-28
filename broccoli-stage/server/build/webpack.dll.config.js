const path = require('path')
const webpack = require('webpack');
const CleanWepackPlugin = require('clean-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: {
        reacts: ['react', 'react-dom', 'react-router', 'react-router-dom'],
        biz_charts: ['bizcharts'],
        ant_icon: ['@ant-design/icons/lib/dist.js']
    },
    output: {
        // publicPath: "http://static2.pp.ximalaya.com/lib/broccoli-stage/last/dll",
        path: path.resolve(__dirname, '../../', 'dll'),
        filename: "[name].dll.js",
        library: "[name]_dll"
    },
    plugins: [
        new CleanWepackPlugin(['dll'], {
            root: path.join(__dirname, '../../')
        }),
        new  webpack.DllPlugin({
            name: '[name]_dll',
            path: path.join(__dirname, '../../', 'dll/[name].manifest.json'),
        })
    ],
    performance: false
}
