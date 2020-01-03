//登录相关
import React, { Component } from "react";
import Api from "@/api";
import { inject, observer } from "mobx-react";
import { HTTP_STATUS } from "@/shared/common/constants";
import { IUserStore } from "@/models/user";

type P = {
  userStore?: IUserStore;
};
type S = {};

@inject("userStore")
@observer
class LoginCheck extends Component<P, S> {
  UNSAFE_componentWillMount() {

    console.log(window.location.pathname)
    // if (window.location.pathname === "/") {
    //   //
    // } else {
    //   this.isLogin();
    // }
  }

  isLogin = async () => {
    const res = await Api.auth.checkLoginState(new Date().getTime());
    console.log({ res });
    //已登录
    if (HTTP_STATUS.SUCCESSS === res.ret && res.login) {
      this.getUserInfo();
    } else {
      this.login();
    }
  };

  getUserInfo = async () => {
    const res = await Api.auth.getUserInfo();
    console.log({ res });
    if (HTTP_STATUS.SUCCESSS === res.ret) {
      this.props.userStore.setUserInfo(res);
    }
  };

  login = () => {
    Api.auth.login();
  };

  render() {
    return null;
  }
}

export default LoginCheck;
