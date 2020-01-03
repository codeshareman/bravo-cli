const env = "test";

const config = {
  test: {
    //requestUrl: "//qudao.test.ximalaya.com",
    requestUrl: "/",
    authUrl: "//passport.test.ximalaya.com"
  },
  uat: {
    requestUrl: "//qudao.uat.ximalya.com",
    authUrl: "//passport.uat.ximalaya.com"
  },
  prod: {
    requestUrl: "//qudao.ximalya.com",
    authUrl: "//passport.ximalaya.com"
  }
};

export const LOGIN_URL = config[env].authUrl + "/page/web/login";

export default config[env];
