import { observable, action } from "mobx";
import { UserInfoResponse } from "@/api/service/AuthService";
import { AccountStatusDTO, BasicUserInfo } from "@/api/service/AccountService";

//用户信息
class UserStore {
  @observable userInfo: BasicUserInfo =
    JSON.parse(sessionStorage.getItem("userInfo")) || null;

  @observable isLogin: boolean =
    JSON.parse(sessionStorage.getItem("isLogin")) || false;

  @observable accountInfo: AccountStatusDTO = null;

  @action setUserInfo = (userInfo: BasicUserInfo) => {
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    this.userInfo = userInfo;
  };

  @action setIsLogin = (isLogin: boolean) => {
    sessionStorage.setItem("isLogin", JSON.stringify(isLogin));
    this.isLogin = isLogin;
  };

  @action setAccountInfo = (accountInfo: AccountStatusDTO) => {
    sessionStorage.setItem("accountInfo", JSON.stringify(accountInfo));
    this.accountInfo = accountInfo;
  };

  @action clear = () => {
    this.isLogin = null;
    this.userInfo = null;
    this.accountInfo = null;
  };
}

export default new UserStore();

export interface IUserStore {
  isLogin: boolean;
  userInfo: BasicUserInfo;
  accountInfo: AccountStatusDTO;
  clear();
  setIsLogin(isLogin: boolean);
  setUserInfo(userInfo: BasicUserInfo);
  setAccountInfo(accountInfo: AccountStatusDTO);
}
