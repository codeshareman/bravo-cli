import API from './axios';
import config from './config';

import FirstChannelService from './service/FirstChannelService';
import ChannelStrategyService from '@xmly/cbp-spec/lib/portal/service/oss/ChannelStrategyService';
import TempStrategyService from '@xmly/cbp-spec/lib/portal/service/oss/TempStrategyService';
import OrderService from '@xmly/cbp-spec/lib/portal/service/oss/OrderService';
import RewardService from '@xmly/cbp-spec/lib/cps/service/Award';
import AuthService from '@xmly/cbp-spec/lib/portal/service/oss/AuthService';
import SupplyChainService from '@xmly/cbp-spec/lib/cps/service/SupplyChainService';
import AccountService from '@xmly/cbp-spec/lib/portal/service/oss/AccountService';
import UserManageService from '@xmly/cbp-spec/lib/portal/service/oss/BackendAccountService';

// 权限认证
const baseApiName = '/portal-oss';
const requestBaseName = config.requestUrl + baseApiName;

const auth = new AuthService(API(config.requestUrl));
const account = new AccountService(API(requestBaseName));
const userManage = new UserManageService(API(requestBaseName));
const channel = new ChannelStrategyService(API(requestBaseName));
const tempStrategy = new TempStrategyService(API(requestBaseName));
const order = new OrderService(API(requestBaseName));
const reward = new RewardService(API(config.requestUrl));
const firstChannel = new FirstChannelService(API(config.firstChannelUrl));
const supplyChain = new SupplyChainService(API(config.requestUrl));

export default {
  auth,
  account,
  channel,
  tempStrategy,
  order,
  reward,
  firstChannel,
  supplyChain,
  userManage,
};
