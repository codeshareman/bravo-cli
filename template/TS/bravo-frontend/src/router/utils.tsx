import * as React from "react";
import { Spin, message } from "antd";
import config, { IRouteItem, permsConfig } from "./config";
import { Route, Redirect, matchPath } from "react-router-dom";
import { matchRoutes } from "react-router-config";
import {
  BASE_PATH,
  FirstRouteIndex,
  HTTP_STATUS
} from "@/shared/common/constants";
import authStore from "@/models/auth";
import AuthorizedRoute from "./AuthorizedRoute";
import Api from "@/api";

// 获取路由
export function getMenuByPath() {
  const pathname = window.location.pathname.split("/")[FirstRouteIndex];
  const curMenu = config.filter(item => {
    const curPath = item.path.substring(1);
    return curPath === pathname;
  });
  return curMenu[0];
}

/**
 * 根据pathname查询路由信息,默认为 window.location.pathname ，返回的路由中包含上层路由
 * @param pathname
 */

export const getCurrentRouteByPath: (
  pathname?: string
) => IRouteItem[] = pathname => {
  const currentRoute = [];
  const _match = (pathname, routes: IRouteItem[]) => {
    if (!routes || !routes.length) {
      return false;
    }
    routes.forEach(route => {
      const current = matchPath(pathname, route);
      if (current) {
        currentRoute.push({
          ...current,
          title: route.title
        });
        _match(pathname, route.childRoute);
      }
    });
  };
  _match(pathname || window.location.pathname, config);
  return currentRoute;
};

export const BundleCompo = function(Compo) {
  return class extends React.PureComponent {
    render() {
      return (
        <React.Suspense
          fallback={
            <div
              style={{
                textAlign: "center",
                padding: "100px 50px"
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

/**
 * 获取路由结构
 */
export const renderRouter = (configs: IRouteItem[]) => {
  let routes = [];
  configs.forEach((item: IRouteItem) => {
    const { path, component, childRoute = [] } = item;

    const route = <Route key={path} exact path={path} component={component} />;
    route && routes.push(route);
    //遍历子路由
    if (childRoute && childRoute.length) {
      const subRoutes = renderRouter(childRoute);
      routes = routes.concat(subRoutes);
    }
  });

  return routes;
};

/**
 * 获取路由结构
 */
export const getRouter = (configs: IRouteItem[]) => {
  let routes = [];
  configs.forEach((item: IRouteItem) => {
    const { path, noAuth = false, childRoute, ...rest } = item;

    const route = noAuth ? (
      <Route key={path} exact path={path} childRoute={childRoute} {...rest} />
    ) : (
      <AuthorizedRoute
        key={path}
        exact
        path={path}
        childRoute={childRoute}
        {...rest}
      />
    );
    route && routes.push(route);
    //遍历子路由
    if (childRoute && childRoute.length) {
      const subRoutes = renderRouter(childRoute);
      routes = routes.concat(subRoutes);
    }
  });

  return routes;
};

export const getBreadcrumbRoutes = pathname => {
  const currentRoutes = getCurrentRouteByPath(pathname);
  let routes = [];
  if (currentRoutes && currentRoutes.length) {
    currentRoutes.forEach(r => {
      routes.push({
        path: r.path,
        name: r.title
      });
    });
  }
  return routes;
};

export const getRouteAuthority = () => {
  let routeArray = [];
  if (!authStore.isInit) {
    Api.account.perms().then(res => {
      if (HTTP_STATUS.SUCCESSS == res.code) {
        authStore.setPerms(res.data || []);
      } else {
        console.log(res.message);
        //message.error(res.message);
      }
    });
  } else {
    authStore.perms.forEach(perm => {
      routeArray = routeArray.concat(permsConfig[perm] || []);
    });
    //数组去重
    routeArray = Array.from(new Set(routeArray));
  }
  return routeArray;
};

export const checkPermissions: (pathname: string) => boolean = pathname => {
  const perems = getRouteAuthority();
  const res = !!perems.includes(pathname);
  return res;
};
