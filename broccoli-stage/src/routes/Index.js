<<<<<<< HEAD
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Menu, Layout, Icon } from "antd";
const { Header, Sider, Content } = Layout;

class IndexComponent extends Component {
  state = {
    collapsed: false
  };

  componentWillMount() {
    window.__main__.routerController["broccoli"] = this.props.history;
=======
import React, { Component } from 'react'
import { Layout, Menu, Icon, Spin } from 'antd';
import { Link } from 'react-router-dom'
import SideMenu from '../layouts/SideMenu'
import MainContent from '../layouts/MainContent'
import PageHeader from '../layouts/PageHeader'
const { Header, Sider, Content } = Layout;

class IndexComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
        collapsed: false,
        isLoading: true
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false
    })
>>>>>>> 5604be6c09fa0adc739f709ce09595ec8dddd55f
  }

  toggle = () => {
    this.setState({
<<<<<<< HEAD
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          className="side-menu"
          style={{minHeight: '100vh'}}
        >
          <div className="logo"  style={{height: '80px'}}/>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span>Broccoli-charts</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
              style={{padding: '25px'}}
            />
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(IndexComponent);
=======
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    const { isLoading } = this.state
    return (
        <Layout>
            <SideMenu collapsed={this.state.collapsed}></SideMenu>
            <Layout>
                <PageHeader collapsed={this.state.collapsed} toggle={this.toggle}></PageHeader>
                <Spin size="large" spinning={isLoading}>
                  <MainContent>
                    {this.props.children}
                  </MainContent>
                </Spin>
          </Layout>
        </Layout>

    );
  }
}

export default IndexComponent
>>>>>>> 5604be6c09fa0adc739f709ce09595ec8dddd55f
