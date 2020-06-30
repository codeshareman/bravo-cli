export enum Profile {
  uar = 'uat',
  test = 'test',
  prod = 'prod',
  gate = 'gate'
}

export const Domain: Readonly<{ [key in Profile]: string }> = {
  [Profile.uar]: 'wws.uat.ximalaya.com',
  [Profile.test]: 'wws.test.ximalaya.com',
  [Profile.prod]: 'wws.ximalaya.com',
  [Profile.gate]: 'http://wws.test.ximalaya.com/wws-gateway/yonyou'
}

//设置运行环境的域名
export const RuntimeProfile: Profile = (process.env['profile'] as Profile) || Profile.gate

//Ximall测试用账号及密码
export const userid = '18613234020'
export const userpwd = 'y123456'