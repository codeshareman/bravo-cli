const env = 'test';

const config = {
  test: {
    requestUrl: 'http://qudao.test.ximalaya.com',
    authUrl: '//passport.test.ximalaya.com',
  },
  uat: {
    requestUrl: 'http://qudao.uat.ximalaya.com',
    authUrl: '//passport.uat.ximalaya.com',
  },
  prod: {
    requestUrl: 'http://qudao.ximalaya.com',
    authUrl: '//passport.ximalaya.com',
  },
};

export default config[env];
