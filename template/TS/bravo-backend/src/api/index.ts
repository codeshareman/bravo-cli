import API from './axios';
import config from './config';
import AccountService from '@/client/portal/service/oss/AccountService';
import ChannelStrategyService from '@/client/portal/service/oss/ChannelStrategyService';
import TempStrategyService from '@/client/portal/service/oss/TempStrategyService';
import OrderService from '@/client/portal/service/oss/OrderService';
import AuthService from '@/client/portal/service/oss/AuthService';

const baseApiName = config.requestUrl + '/portal-oss';

const auth = new AuthService(API(config.requestUrl));
const account = new AccountService(API(baseApiName));
const channel = new ChannelStrategyService(API(baseApiName));
const tempStrategy = new TempStrategyService(API(baseApiName));
const order = new OrderService(API(baseApiName));

export default {
  auth,
  account,
  channel,
  tempStrategy,
  order,
};
