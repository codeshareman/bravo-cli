import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Menu, Layout, Icon } from "antd";
import "@SRC/assets/css/theme.scss";
import storage from "@SRC/utils/storage";
import { getMenu } from "@SRC/utils/common";
const { Header, Sider, Content, Footer } = Layout;

class IndexComponent extends Component {
  state = {
    collapsed: false
  };

  componentWillMount() {}
  componentDidMount() {}
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
  setSelected = (item , key, keyPath) => {
    storage.defaultKey = item.key;
  }
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
          <div className="logo">
            {this.state.collapsed ? <Icon type="shop" /> : "曲江图书馆"}
          </div>
          <Menu theme="dark" mode="inline" defaultOpenKeys={['sub-0']} defaultSelectedKeys={[storage.defaultKey]} onClick={this.setSelected}>
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
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px 0",
              overflow: "initial",
              minHeight: "100vh"
            }}
          >
            <div
              style={{ padding: 24, background: "#fff", textAlign: "center" }}
            >
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Copyright ©2018 Created by Ximalaya
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(IndexComponent);
