import React from "react";
import { Route, NavLink, match } from "react-router-dom";
import config, { RouteItem } from "./config";
import { Menu, Icon } from "antd";
import { BASE_PATH } from "@/utils/constant";

//执行路由遍历时,设置值
export let breadcrumbNameMaps = [];
export interface BreadcrumbRoute {
  path: string;
  breadcrumbName: string;
  children?: BreadcrumbRoute[];
}

/**
 * 获取路由结构
 */
export const renderRouter = (configs: RouteItem[]) => {
  let routes = [];
  configs.forEach((item: RouteItem) => {
    const { path, title, component, children = [] } = item;
    const route = (
      <Route
        key={path}
        exact={true}
        path={BASE_PATH + path}
        component={component}
      />
    );
    breadcrumbNameMaps[path] = title;
    routes.push(route);
    //遍历子路由
    if (children && children.length) {
      const subRoutes = renderRouter(children);
      routes = routes.concat(subRoutes);
    }
  });
  return routes;
};

/**
 * 获取侧边栏菜单
 */
export const renderSideMenu = (configs: RouteItem[]) => {
  if (!configs || !configs.length) return [];

  let menus = [];

  configs.forEach(item => {
    const { path, title, icon, children, hideMenu = false } = item;

    //是否有子菜单
    const hasSubMenu = children && children.length;
    let menuItem = null;
    if (hasSubMenu) {
      //判断子菜单是否全部隐藏
      const hideMenus = children.filter(item => item.hideMenu);

      if (hideMenus.length < children.length) {
        const subMenus = renderSideMenu(children);
        menuItem = (
          <Menu.SubMenu
            key={BASE_PATH + path}
            title={
              <span>
                {icon ? <Icon type="pie-chart" /> : null}
                <span>{title}</span>
              </span>
            }
          >
            {subMenus}
          </Menu.SubMenu>
        );
      } else {
        menuItem = hideMenu ? null : (
          <Menu.Item key={BASE_PATH + path}>
            <NavLink to={BASE_PATH + path}>
              {icon ? <Icon type="pie-chart" /> : null}
              <span>{title}</span>
            </NavLink>
          </Menu.Item>
        );
      }
    } else {
      menuItem = hideMenu ? null : (
        <Menu.Item key={BASE_PATH + path}>
          <NavLink to={BASE_PATH + path}>
            {icon ? <Icon type="pie-chart" /> : null}
            <span>{title}</span>
          </NavLink>
        </Menu.Item>
      );
    }

    menuItem && menus.push(menuItem);
  });

  return menus;
};

/**
 * 获取面包屑
 * @param match
 */
export const getBreadcrumb = (match: match) => {
  const indexPath = "/";
  const pathSnippets = match.path
    .split(BASE_PATH)[1]
    .split("/")
    .filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const path = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return {
      path,
      breadcrumbName: breadcrumbNameMaps[path]
    };
  });

  //当前级链相关的全部路由
  const routes = [
    // {
    //   path: indexPath,
    //   breadcrumbName: breadcrumbNameMaps[indexPath]
    // }
  ].concat(extraBreadcrumbItems);

  return {
    itemRender: (route, params, routes, paths) => {
      const last = routes.indexOf(route) === routes.length - 1;
      return last ? (
        <span>{route.breadcrumbName}</span>
      ) : (
        <NavLink to={ BASE_PATH + route.path}>{route.breadcrumbName}</NavLink>
      );
    },
    routes
  };
};

/**
 * 渲染自定义面包屑
 * @param routes
 */
export const renderSelfBreadcrumb = (routes: BreadcrumbRoute[]) => {
  return {
    itemRender: (route, params, routes, paths) => {
      const last = routes.indexOf(route) === routes.length - 1;
      return last ? (
        <span>{route.breadcrumbName}</span>
      ) : (
        <NavLink to={BASE_PATH + route.path}>{route.breadcrumbName}</NavLink>
      );
    },
    routes
  };
};

//路由
export const routes = renderRouter(config);

//侧边栏导航
export const sideMenu = renderSideMenu(config);
