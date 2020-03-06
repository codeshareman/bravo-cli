const path = require('path')
const utils = require('../build/utils')

const projectName = 'merchant-b'
const distDir = 'dist'
const { version } = require('../../package.json')

module.exports = {
  port: 8000,
  sourcemapUrl: `http://sourcemap.ximalaya.com/${projectName}/${distDir}/`,
  test: {
    assetsRoot: '',
    assetsPublicPath: `//static2.test.ximalaya.com/yx/merchant-b/${version}/dist/`,
    chunkFilename: 'js/[name].js',
  },
  uat: {
    assetsPublicPath: `//s1.uat.xmcdn.com/yx/merchant-b/${version}/dist/`,
    chunkFilename: 'js/[name].js',
  },
  production: {
    assetsPublicPath: `//s1.xmcdn.com/yx/merchant-b/${version}/dist/`,
    chunkFilename: 'js/[name].js',
  },
  theme: {
    'primary-color': '#215FFF',
    'link-color': '#215FFF', // 链接色
    'success-color': '#6EB64B', // 成功色
    'warning-color': '#E35A5A', // 警告色
    'error-color': '#E35A5A', // 错误色
    'font-size-base': '12px', // 主字号
    'heading-color': '#333333', // 标题色
    'text-color': '#324150', // 主文本色
    'text-color-secondary': '#999', // 次文本色
    'disabled-color': '#BEBEBE', // 失效色
    'border-radius-base': '4px', // 组件/浮层圆角
    //"border-color-base": "#E1A661", // 边框色
    // "box-shadow-base": "0 2px 8px rgba(0, 0, 0, .15)" // 浮层阴影
  },
}
