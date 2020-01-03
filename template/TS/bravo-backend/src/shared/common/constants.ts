export const BASE_PATH = '/app/entry/merchant-b';
export const FirstRouteIndex = 4;

export const AJAX_STATUS = {
  SUCCESS: 0,
};

export const EnvEnum = {
  DEV: 'dev',
  TEST: 'test',
  UAT: 'uat',
  PROD: 'prod',
};

export const systemIdList = {
  dev: '123142',
  test: '123142',
  uat: '123142',
  pro: '123142',
};

export const UrlConfig = {
  dev: {
    loginUrl: 'http://qudao.test.ximalaya.com/portal-oss/oauth2/authorization/keycloak',
    logoutUrl: 'http://ops.test.ximalaya.com/cas-server/logout',
    serviceUrl: 'http://qudao.test.ximalaya.com/portal-oss/callback?client_name=CasClient',
  },
  test: {
    loginUrl: 'http://qudao.test.ximalaya.com/portal-oss/oauth2/authorization/keycloak',
    logoutUrl: 'http://ops.test.ximalaya.com/cas-server/logout',
    serviceUrl: 'http://qudao.test.ximalaya.com/portal-oss/callback?client_name=CasClient',
  },
  uat: {
    loginUrl: 'http://qudao.ximalaya.com/portal-oss/oauth2/authorization/keycloak',
    logoutUrl: 'http://ops.test.ximalaya.com/cas-server/logout',
    serviceUrl: 'http://qudao.uat.ximalaya.com/portal-oss/callback?client_name=CasClient',
  },
  prod: {
    loginUrl: 'http://qudao.ximalaya.com/portal-oss/oauth2/authorization/github',
    logoutUrl: 'http://ops.ximalaya.com/cas-server/logout',
    serviceUrl: 'http://qudao.ximalaya.com/portal-oss/callback?client_name=CasClient',
  },
};
