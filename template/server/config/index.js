const path = require("path");
const func = require("./func");

// 项目名配置
const appName = {
  prefix: "profit",
  suffix: "center"
};

module.exports = {
  production: {
    assetsRoot: path.join(__dirname, "../../", "dist"),
    assetsPublicPath: `//s1.xmcdn.com/lib/${appName.prefix}-${appName.suffix}/last/dist/`,
    assetsSubDictionary: "",    
    chunkFilename: `js/${appName.prefix}_[name].js?v=[hash:8]`,
    manifestName: `manifest-${appName.prefix}`
  },
  development: {
    mainEntryKey: `${appName.prefix}_main`, 
    host: func.getIPAdress() || "localhost",
    assetsRoot: path.join(__dirname, "../../", "dist"),
    assetsSubDictionary: "",
    assetsPublicPath: "/",
    manifestName: `manifest-${appName.prefix}`
  },
  test: {
    host: func.getIPAdress() || "localhost",
    assetsRoot: path.join(__dirname, "../../", "dist"),
    assetsPublicPath: `//static2.pp.ximalaya.com/lib/${appName.prefix}-${
        appName.suffix
      }/last/dist/`,
    assetsSubDictionary: "",
    chunkFilename: `js/${appName.prefix}_[name].js?v=[hash:8]`,
    manifestName: `manifest-${appName.prefix}`
  },
  uat: {
    host: func.getIPAdress() || "localhost",
    assetsRoot: path.join(__dirname, "../../", "dist"),
    assetsPublicPath: `//s1.uat.xmcdn.com/lib/${appName.prefix}-${
        appName.suffix
      }/last/dist/`,
    assetsSubDictionary: "",
    chunkFilename: `js/${appName.prefix}_[name].js?v=[hash:8]`,
    manifestName: `manifest-${appName.prefix}`
  },
  mock: {
    host: func.getIPAdress() || "localhost",
    port: 3000
  }
};
