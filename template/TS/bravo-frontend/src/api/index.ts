import API from "./axios";
import config from "./config";
import AuthService from "./service/AuthService";
import AccountService from "./service/AccountService";
import VerifyCodeService from "./service/VerifyCodeService";
import PurchaseService from "./service/PurchaseService";
import CartService from "./service/CartService";
import DistrictService from "./service/DistrictService";
import ProductService from "./service/ProductService";
import RechargeService from "./service/RechargeService";
import ContactService from "./service/ContactService";
import OrderService from "./service/OrderService";

// 权限认证

const defaultApi = API();

const auth = new AuthService(API(config.authUrl));
const account = new AccountService(defaultApi);
const verifyCode = new VerifyCodeService(defaultApi);
const purchase = new PurchaseService(defaultApi);
const cart = new CartService(defaultApi);
const district = new DistrictService(defaultApi);
const product = new ProductService(defaultApi);
const recharge = new RechargeService(defaultApi);
const contact = new ContactService(defaultApi);
const order = new OrderService(defaultApi);

export default {
  auth,
  account,
  verifyCode,
  purchase,
  cart,
  district,
  product,
  recharge,
  contact,
  order
};
