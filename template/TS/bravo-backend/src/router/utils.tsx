import * as React from 'react';
import { Spin, Icon } from 'antd';
import { Route, Link } from 'react-router-dom';

import Regex from '@/shared/common/regex';
import config, { RouteItem } from './config';
import { matchRoutes } from 'react-router-config';
import { BASE_PATH, FirstRouteIndex } from '@/shared/common/constants';
import { Menu } from 'antd';

const SubMenu = Menu.SubMenu;

type menuDefaultType = {
  defaultOpenKeys: string[];
  defaultSelectedKeys: string[];
};

let menuDefaultKeys = {
  defaultOpenKeys: [],
  defaultSelectedKeys: [],
};

// 获取路由
export function getMenuByPath() {
  const pathname = window.location.pathname.split('/')[FirstRouteIndex];
  const curMenu = config.filter(item => {
    const curPath = item.path.substring(1);
    return curPath === pathname;
  });

  return curMenu[0];
}

export const BundleCompo = function(Compo) {
  return class extends React.PureComponent {
    render() {
      return (
        <React.Suspense
          fallback={
            <div
              style={{
                textAlign: 'center',
                padding: '100px 50px',
              }}
            >
              <Spin size="large" />
            </div>
          }
        >
          <Compo />
        </React.Suspense>
      );
    }
  };
};

// 根据路由信息获取菜单
export const getRoutesMenu = (routers = config) => {
  return routers.map(item => {
    const iconName = `icon-${item.icon}`;
    if (!item.hideSubMenu && item.children && item.children.length > 0) {
      return (
        <SubMenu
          key={item.id}
          title={
            <span>
              <i className={iconName}></i>
              {item.title}
            </span>
          }
        >
          {getRoutesMenu(item.children)}
        </SubMenu>
      );
    }
    return (
      !item.hideMenu && (
        <Menu.Item key={item.id}>
          <Link to={{ pathname: item.path }}>
            {item.icon && <i className={iconName}></i>}
            {item.title}
          </Link>
        </Menu.Item>
      )
    );
  });
};

export const getMenuDefaultKeyByPath = (routes = config): menuDefaultType => {
  const curPath =
    '/' +
    location.pathname
      .split('/')
      .slice(4)
      .join('/');

  routes.forEach((item, index) => {
    if (item.children && item.children.length) {
      getMenuDefaultKeyByPath(item.children);
    }
    if (item.path === curPath) {
      const idStr = item.id.toString();
      const pIdStr = idStr.substring(0, 3);

      menuDefaultKeys = {
        defaultOpenKeys: [pIdStr],
        defaultSelectedKeys: [pIdStr, idStr],
      };
    }
  });

  return menuDefaultKeys;
};

/**
 * 获取路由结构
 */
export const renderRouter = (configs: RouteItem[]) => {
  let routes = [];
  configs.forEach((item: RouteItem) => {
    const { path, title, component, exact = true, children = [] } = item;
    const routPath = BASE_PATH + path;
    const route = <Route key={routPath} exact={exact} path={path} component={component} />;

    route && routes.push(route);
    //遍历子路由
    if (children && children.length) {
      const subRoutes = renderRouter(children);
      routes = routes.concat(subRoutes);
    }
  });
  return routes;
};

export const getBreadcrumbRoutes = () => {
  const menu = getMenuByPath();
  let routes = [];
  const branch = matchRoutes(config, location.pathname);
  const _getRoutes = (menu: RouteItem) => {
    const { path, title, children } = menu;
    routes.push({
      path,
      name: title,
    });
    if (children && children.length) {
      children.forEach(item => {
        _getRoutes(item);
      });
    }
  };
  _getRoutes(menu);
  return routes;
};

