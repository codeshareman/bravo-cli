import * as React from "react";
import { Avatar, Dropdown, Icon, Menu, message } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { IUserStore } from "@/models/user";
import { IAuthStore } from "@/models/auth";
import { HTTP_STATUS } from "@/shared/common/constants";
import { getImgPath } from "@/shared/common/utils";
import Api from "@/api";

import "./index.scss";

type P = RouteComponentProps & {
  userStore?: IUserStore;
  authStore?: IAuthStore;
};
type S = {};
@inject("userStore", "authStore")
@observer
class GlobalAvatar extends React.Component<P, S> {
  UNSAFE_componentWillMount() {
    //this.getPerms();
    this.getUserInfo();
  }

  getUserInfo = async () => {
    const { userStore } = this.props;
    const { userInfo, isLogin } = userStore;
    if (!userInfo) {
      const res = await Api.account.basicInfo();
      if (HTTP_STATUS.SUCCESSS === res.code) {
        userStore.setUserInfo(res.data);
      } else {
        console.log(res.message);
      }
    }
  };

  getPerms = async () => {
    const res = await Api.account.perms();
    if (HTTP_STATUS.SUCCESSS === res.code) {
      this.props.authStore.setPerms(res.data || []);
    } else {
      //message.error(res.message);
    }
  };

  logout = async () => {
    const res = await Api.auth.logout();
    if (HTTP_STATUS.SUCCESSS === res.ret) {
      sessionStorage.clear();
      this.props.userStore.clear();
      this.props.history.replace("/");
    }
  };

  renderDownMenu = () => {
    const config = [
      {
        name: "退出",
        link: "",
        onClick: this.logout
      }
    ];
    const mItemList = config.map((item, index) => {
      return (
        <Menu.Item key={index} onClick={item.onClick}>
          {item.name}
        </Menu.Item>
      );
    });
    return <Menu>{mItemList}</Menu>;
  };

  render() {
    const menu = this.renderDownMenu();
    const { userInfo } = this.props.userStore;
    const imgPath = getImgPath();
    return (
      <div className="global-avatar">
        <Avatar
          shape="circle"
          src={userInfo && imgPath + "/" + userInfo.logoPic}
        />
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" >
            {userInfo && userInfo.nickname} <Icon type="down" />
          </a>
        </Dropdown>
      </div>
    );
  }
}

export default withRouter(GlobalAvatar);
