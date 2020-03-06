export const BASE_PATH = '/app/entry/merchant-b';
export const FirstRouteIndex = 4;

export const AJAX_STATUS = {
  // 成功
  SUCCESS: 0,
  //未登录
  UNAUTHENTICATED: 401,
  PERMISSION_DENIED: 403,
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
    keyCloakLoginoutUrl:
      'http://qudao.test.ximalaya.com/auth/realms/dev/protocol/openid-connect/logout?redirect_uri=',
    serviceUrl: 'http://qudao.test.ximalaya.com/portal-oss/callback?client_name=CasClient',
  },
  test: {
    loginUrl: 'http://qudao.test.ximalaya.com/portal-oss/oauth2/authorization/keycloak',
    logoutUrl: 'http://ops.test.ximalaya.com/cas-server/logout',
    serviceUrl: 'http://qudao.test.ximalaya.com/portal-oss/callback?client_name=CasClient',
    keyCloakLoginoutUrl:
      'http://qudao.test.ximalaya.com/auth/realms/dev/protocol/openid-connect/logout?redirect_uri=',
  },
  uat: {
    loginUrl: 'http://qudao.uat.ximalaya.com/portal-oss/oauth2/authorization/keycloak',
    logoutUrl: 'http://ops.uat.ximalaya.com/cas-server/logout',
    serviceUrl: 'http://qudao.uat.ximalaya.com/portal-oss/callback?client_name=CasClient',
    keyCloakLoginoutUrl:
      'http://qudao.uat.ximalaya.com/auth/realms/uat/protocol/openid-connect/logout?redirect_uri=',
  },
  prod: {
    loginUrl: 'https://qudao.ximalaya.com/portal-oss/oauth2/authorization/keycloak',
    logoutUrl: 'https://ops.ximalaya.com/cas-server/logout',
    serviceUrl: 'https://qudao.ximalaya.com/portal-oss/callback?client_name=CasClient',
    keyCloakLoginoutUrl:
      'https://qudao.ximalaya.com/auth/realms/prod/protocol/openid-connect/logout?redirect_uri=',
  },
};
