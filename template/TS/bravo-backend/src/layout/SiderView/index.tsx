import * as React from 'react';
import { Menu } from 'antd';
import { getRoutesMenu, getMenuDefaultKeyByPath } from '@/router/utils';

import './index.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';

type P = RouteComponentProps & {};
type S = {
  openKeys: string[];
  selectedKeys: string[];
  menuConfig: {
    defaultOpenKeys: string[];
    defaultSelectedKeys: string[];
  };
};

// 侧边栏
class SiderView extends React.Component<P, S> {
  state: S = {
    menuConfig: {
      defaultOpenKeys: [],
      defaultSelectedKeys: [],
    },
    openKeys: [],
    selectedKeys: [],
  };

  UNSAFE_componentWillMount() {
    this.setDefaultMenuKeys();
  }

  componentDidMount() {
    this.props.history.listen(info => {
      this.setDefaultMenuKeys();
    });
  }

  setDefaultMenuKeys = () => {
    const menuConfig = getMenuDefaultKeyByPath();
    this.setState({
      menuConfig,
      openKeys: menuConfig.defaultOpenKeys,
      selectedKeys: menuConfig.defaultSelectedKeys,
    });
  };

  handleMenuOpenChange = (openkeys: string[]) => {
    const lastOpenkey = openkeys.pop();
    const { menuConfig } = this.state;
    const curOpenKey = menuConfig.defaultOpenKeys;
    this.setState({
      openKeys: [lastOpenkey],
      selectedKeys: [],
    });
  };

  handleSelect = params => {
    const pId = params.key.substring(0, 3);
    this.setState({
      openKeys: [pId],
      selectedKeys: params.selectedKeys,
    });
  };

  render() {
    const { menuConfig } = this.state;

    return (
      <div className="sider-view">
        <div className="sider-view--children">
          <Menu
            mode="inline"
            defaultOpenKeys={menuConfig.defaultOpenKeys}
            defaultSelectedKeys={menuConfig.defaultSelectedKeys}
            openKeys={this.state.openKeys}
            selectedKeys={this.state.selectedKeys}
            onOpenChange={this.handleMenuOpenChange}
            onSelect={this.handleSelect}
          >
            {getRoutesMenu()}
          </Menu>
        </div>
      </div>
    );
  }
}

export default withRouter(SiderView);
