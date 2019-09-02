import * as React from "react";

import { Menu, Layout, Icon } from "antd";
import { ClickParam } from "antd/lib/menu";
import { Switch } from "react-router-dom";
import storage from "@/utils/storage";

const { Header, Sider, Content, Footer } = Layout;

import { routes, sideMenu } from "@/router";

type P = {};

type S = {
  collapsed: boolean;
};

class LocalMenu extends React.Component<P, S> {
  state = {
    collapsed: false
  };

  renderSideMenu = () => {
    return sideMenu;
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  setSelected = (param: ClickParam) => {
    storage.defaultKey = param.key;
  };

  render() {
    return (
      <Layout>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0
          }}
          trigger={null}
        >
          <div
            className="logo"
            style={{
              height: "64px",
              color: "#fff",
              lineHeight: "64px",
              textAlign: "center",
              fontSize: "20px"
            }}
          >
            {this.state.collapsed ? <Icon type="shop" /> : "万物声后台模版"}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            inlineIndent={5}
            defaultOpenKeys={["sub-0"]}
            defaultSelectedKeys={[storage.defaultKey]}
            onClick={this.setSelected}
          >
            {this.renderSideMenu()}
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: this.state.collapsed ? 80 : 200 , minHeight: "100vh" }}>
          <Header style={{ background: "#fff", padding: 0 }}>
            <Icon
              className="trigger"
              style={{ fontSize: 20, marginLeft: 20 }}
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
          </Header>
          <Content>
            <Switch>{routes}</Switch>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Copyright ©2018 Created by Ximalaya
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default LocalMenu;
