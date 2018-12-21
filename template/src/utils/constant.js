
// APP配置
const { env } = window.config;
const APP_CONFIG = {
    appName: 'bravo-stage',
    registerName: 'bravo',
    basePath: env === "DEV"
      ? "http://wws.test.ximalaya.com/wws-b/v2/api/"
      : "https://wws.ximalaya.com/wws-b/v2/api/"
}
// AJAX状态码
const AJAX_STATUS = {
    SUCCESS: 200,
    PAY_ERROR: 1001
}

export { 
    APP_CONFIG,
    MOCK_CONFIG,
    AJAX_STATUS
}