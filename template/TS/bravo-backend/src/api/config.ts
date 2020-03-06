import { getEnv } from '@/shared/common/utils';

const env = getEnv();

const config = {
  test: {
    requestUrl: '//qudao.test.ximalaya.com',
    authUrl: '//passport.test.ximalaya.com',
    // 获取一起渠道接口前缀，后端说不知道接口去哪掉，故用以前开放平台接口
    firstChannelUrl: '//cms.test.9nali.com/openapi-activity-admin',
  },
  uat: {
    requestUrl: '//qudao.uat.ximalaya.com',
    authUrl: '//passport.uat.ximalaya.com',
    firstChannelUrl: '//cms.uat.9nali.com/openapi-activity-admin',
  },
  prod: {
    requestUrl: '//qudao.ximalaya.com',
    authUrl: '//passport.ximalaya.com',
    firstChannelUrl: '//qudao.ximalaya.com/proxy/cms/openapi-activity-admin',
  },
};

export default config[env] || config['test'];
