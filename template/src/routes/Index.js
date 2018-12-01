import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Menu, Layout, Icon } from "antd";
const { Header, Sider, Content } = Layout;

class IndexComponent extends Component {
  state = {
    collapsed: false
  };

  componentWillMount() {
    // const registParams = {
    //   appName: 'broccoli',
    //   history: this.props.history
    // };
    // console.log(window.ws);
    // window.ws.regist(registParams);
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            {this.props.children}
          </Content>
    )
  }
}

export default withRouter(IndexComponent);
