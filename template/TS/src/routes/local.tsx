import * as React from "react";
import { withRouter, Link, RouteComponentProps } from "react-router-dom";
import { Menu, Layout, Icon } from "antd";
import { ClickParam } from "antd/lib/menu";

import storage from "../utils/storage";
import { getMenu } from "../utils/common";
const { Header, Sider, Content, Footer } = Layout;

type P = RouteComponentProps & {};

type S = {
  collapsed: boolean;
};

class IndexComponent extends React.Component<P, S> {
  state = {
    collapsed: false
  };

  renderSideMenu = () => {
    const menuData = getMenu();
    let menuNode = [];
    const { SubMenu } = Menu;
    menuData.map((item, key) => {
      if (item.path !== "/") {
        if (item.children) {
          const children = item.children;
          menuNode.push(
            <SubMenu
              key={`sub-${key}`}
              title={
                <span>
                  <Icon type={item.iconClass} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {children.map((subItem, subKey) => {
                return (
                  <Menu.Item key={subItem.id}>
                    <Link to={subItem.path}>
                      <span>{subItem.title}</span>
                    </Link>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          );
        } else {
          menuNode.push(
            <Menu.Item key={item.id}>
              <Icon type={item.iconClass} />
              <span>{item.title}</span>
            </Menu.Item>
          );
        }
      }
    });
    return menuNode;
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
    const menuNode = this.renderSideMenu();
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
            {this.state.collapsed ? <Icon type="shop" /> : "万物生后台模版"}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={["sub-0"]}
            defaultSelectedKeys={[storage.defaultKey]}
            onClick={this.setSelected}
          >
            {menuNode &&
              menuNode.map((item, index) => {
                return item;
              })}
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: this.state.collapsed ? 80 : 200 }}>
          <Header style={{ background: "#fff", padding: 0 }}>
            <Icon
              className="trigger"
              style={{ fontSize: 20 , marginLeft:20 }}
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
          </Header>
          <Content>{this.props.children}</Content>
          <Footer style={{ textAlign: "center" }}>
            Copyright ©2018 Created by Ximalaya
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(IndexComponent);
