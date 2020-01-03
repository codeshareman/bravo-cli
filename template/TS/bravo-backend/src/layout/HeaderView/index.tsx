import * as React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

import GlobalAvatar from '@/components/GlobalAvatar';
import GlobalOrder from '@/components/GlobalOrder';
import config from '@/router/config';
import { BASE_PATH, FirstRouteIndex } from '@/shared/common/constants';

import './index.scss';

const { Header } = Layout;
const { SubMenu } = Menu;

type P = {};
type S = {};

// 头部导航
let defaultSelectedKey = '';
let defaultOpenKey = '';

class HeaderView extends React.Component<P, S> {
  
  getDefaultKeys = (routers = config) => {
    const pathArr = location.pathname.split('/');
    const curPath = pathArr[FirstRouteIndex];
    const fullPath = location.pathname;
    if (curPath === undefined) {
      defaultSelectedKey = routers[0].id.toString();
    } else {
      routers.forEach((item: any) => {
        let curId = item.id.toString();
        let parentId = curId.substring(0, 3);
        const fullRoutePath = BASE_PATH + item.path;
        const isFurryMatch = ~fullRoutePath.indexOf(':');
        const furryMatchIndex = fullRoutePath.indexOf(':') - 1;

        if (item.children && item.children.length > 0) {
          this.getDefaultKeys(item.children);
        }

        if (curPath === item.path.substring(1)) {
          defaultOpenKey = item.id.toString();
        }

        if (
          fullPath === fullRoutePath ||
          (isFurryMatch && fullPath.includes(fullRoutePath.substring(0, furryMatchIndex)))
        ) {
          if (item.hideMenu) {
            defaultSelectedKey = parentId;
          } else {
            defaultSelectedKey = curId;
          }
        }
      });
    }

    return {
      defaultOpenKey,
      defaultSelectedKey,
    };
  };

  render() {
    return (
      <div className="header-wrapper">
        <Header className="header">
          <div className="logo" />
          <GlobalAvatar />
        </Header>
      </div>
    );
  }
}

export default HeaderView;
