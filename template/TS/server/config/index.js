const func = require("./func");

// 项目名配置
const appName = {
  prefix: "cps-data",
  suffix: "center"
};

module.exports = {
  production: {
    assetsRoot: func.resolve("dist"),
    assetsPublicPath: `//s1.xmcdn.com/sr012018/${appName.prefix}-${
      appName.suffix
    }/last/dist/`,
    assetsDllPath: `//s1.xmcdn.com/sr012018/${appName.prefix}-${
      appName.suffix
    }/last/dll/`,
    assetsSubDictionary: "",
    chunkFilename: `js/${appName.prefix}_[name].js?v=${Date.now()}`,
    manifestName: `manifest-${appName.prefix}`
  },
  development: {
    mainEntryKey: `${appName.prefix}_main`,
    host: func.getIPAdress() || "localhost",
    assetsRoot: func.resolve("dist"),
    assetsSubDictionary: "",
    assetsPublicPath: "/",
    chunkFilename: `js/${appName.prefix}_[name].js?v=${Date.now()}`,
    manifestName: `manifest-${appName.prefix}`
  },
  test: {
    host: func.getIPAdress() || "localhost",
    assetsRoot: func.resolve("dist"),
    assetsPublicPath: `//static2.pp.ximalaya.com/sr012018/${appName.prefix}-${
      appName.suffix
    }/last/dist/`,
    assetsDllPath: `//static2.pp.ximalaya.com/sr012018/${appName.prefix}-${
      appName.suffix
    }/last/dll/`,
    assetsSubDictionary: "",
    chunkFilename: `js/${appName.prefix}_[name].js?v=${Date.now()}`,
    manifestName: `manifest-${appName.prefix}`
  },
  uat: {
    host: func.getIPAdress() || "localhost",
    assetsRoot: func.resolve("dist"),
    assetsPublicPath: `//s1.uat.xmcdn.com/sr012018/${appName.prefix}-${
      appName.suffix
    }/last/dist/`,
    assetsDllPath: `//s1.uat.xmcdn.com/sr012018/${appName.prefix}-${
      appName.suffix
    }/last/dll/`,
    assetsSubDictionary: "",
    chunkFilename: `js/${appName.prefix}_[name].js?v=${Date.now()}`,
    manifestName: `manifest-${appName.prefix}`
  },
  mock: {
    host: func.getIPAdress() || "localhost",
    port: 3000
  },
  cssModifyVars: {
    "primary-color": "#13C2C2", // 全局主色
    "link-color": "#13c2c2", // 链接色
    "success-color": "#6EB64B", // 成功色
    "warning-color": "#E35A5A", // 警告色
    "error-color": "#E35A5A", // 错误色
    "font-size-base": "14px", // 主字号
    "heading-color": "#333333", // 标题色
    "text-color": "#666", // 主文本色
    "text-color-secondary": "#999", // 次文本色
    "disabled-color": "#BEBEBE", // 失效色
    "border-radius-base": "4px" // 组件/浮层圆角
    //"border-color-base": "#E1A661", // 边框色
    // "box-shadow-base": "0 2px 8px rgba(0, 0, 0, .15)" // 浮层阴影
  }
};
