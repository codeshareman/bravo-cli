import * as React from "react";
import { Layout, Menu, message } from "antd";
import { Link, withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { IRouteItem } from "@/router/config";
import GlobalAvatar from "@/components/GlobalAvatar";
import GlobalOrder from "@/components/GlobalOrder";
import config from "@/router/config";
import {
  BASE_PATH,
  FirstRouteIndex,
  HTTP_STATUS
} from "@/shared/common/constants";
import { IAuthStore } from "@/models/auth";
import Api from "@/api";

import "./index.scss";

const { Header } = Layout;
const { SubMenu } = Menu;

type P = {
  hideMenu?: boolean;
  authStore?: IAuthStore;
};
type S = {};

// 头部导航
let defaultSelectedKey = "";
let defaultOpenKey = "";

@inject("authStore")
@observer
class HeaderView extends React.Component<P, S> {
  UNSAFE_componentWillMount() {
    //没有权限信息，加载权限信息,有则直接读取
    const { isInit } = this.props.authStore;
    if (!isInit) {
      this.getPerms();
    }
  }

  getPerms = async () => {
    const res = await Api.account.perms();
    if (HTTP_STATUS.SUCCESSS === res.code) {
      this.props.authStore.setPerms(res.data || []);
    } else {
      //message.error(res.message);
    }
  };

  getMenu = () => {};

  getDefaultKeys = (routers = config) => {
    const pathArr = location.pathname.split("/");
    const curPath = pathArr[FirstRouteIndex];
    const fullPath = location.pathname;
    console.log({pathArr, curPath, fullPath}, "----getDefaultKeys----")
    if (curPath === undefined) {
      defaultSelectedKey = routers[0].id.toString();
    } else {
      routers.forEach((item: any) => {
        console.log({item})
        if (item.childRoute && item.childRoute.length > 0) {
          this.getDefaultKeys(item.childRoute);
        }

        if (curPath === item.path.substring(1)) {
          defaultOpenKey = item.id.toString();
        }

        if (fullPath === BASE_PATH + item.path) {
          defaultSelectedKey = item.id.toString();
        }
      });
    }

    console.log({defaultOpenKey, defaultSelectedKey}, "-------")

    return {
      defaultOpenKey,
      defaultSelectedKey
    };
  };

  renderHeaderNav(menu: IRouteItem[]) {
    if (!menu) {
      return null;
    }
    return menu.map(item => {
      if (!item.hideSubMenu && item.childRoute && item.childRoute.length > 0) {
        return (
          <SubMenu key={item.id} title={item.title}>
            {this.renderHeaderNav(item.childRoute)}
          </SubMenu>
        );
      }

      return (
        !item.hideMenu && (
          <Menu.Item key={item.id}>
            <Link to={{ pathname: item.path }}>{item.title}</Link>
          </Menu.Item>
        )
      );
    });
  }

  render() {
    const { hideMenu = false, authStore } = this.props;
    const { menu } = authStore;
    console.log({ menu });
    const defalutInfo = this.getDefaultKeys(menu);
    console.log({ defalutInfo }, "---HeaderView---");
    return (
      <div className="header-wrapper">
        <Header className="header">
          {/* <Link className="logo" to=""></Link> */}
          <a className="logo"></a>
          {hideMenu || !menu.length ? null : (
            <>
              <Menu
                className="h-center"
                mode="horizontal"
                theme="light"
                defaultSelectedKeys={[defalutInfo.defaultSelectedKey]}
                selectedKeys={[defalutInfo.defaultSelectedKey]}
                style={{ lineHeight: "64px" }}
              >
                {this.renderHeaderNav(menu)}
              </Menu>
              <GlobalOrder />
            </>
          )}
          <GlobalAvatar />
        </Header>
      </div>
    );
  }
}

export default HeaderView;
