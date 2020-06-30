import * as React from 'react'
import { Spin, Menu } from 'antd'
import { Route, Link, Redirect } from 'react-router-dom'
import { authStore } from '@/models'
import config, { IRouteItem, permsConfig } from './config'
import AuthorizedRoute from './AuthorizedRoute'
import { FirstRouteIndex } from '@/shared/common/constants'

const SubMenu = Menu.SubMenu

type menuDefaultType = {
  defaultOpenKeys: string[]
  defaultSelectedKeys: string[]
}

let menuDefaultKeys = {
  defaultOpenKeys: [],
  defaultSelectedKeys: [],
}

// 获取路由
export function getMenuByPath() {
  const pathname = window.window.location.pathname.split('/')[FirstRouteIndex]
  const curMenu = config.filter(item => {
    const curPath = item.path.substring(1)
    return curPath === pathname
  })

  return curMenu[0]
}

export const BundleCompo = function(Compo) {
  return class extends React.PureComponent {
    displayName = 'bundle-compo'
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
      )
    }
  }
}

// 根据路由信息获取菜单
export const getRoutesMenu = (routers = config) => {
  return routers.map((item: IRouteItem) => {
    const { noAuth } = item
    const authorized = !noAuth && checkPermissionByPath(item.path)
    if (authorized) {
      const iconName = `icon-${item.icon}`
      if (!item.hideSubMenu && item.childRoute && item.childRoute.length > 0) {
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
            {getRoutesMenu(item.childRoute)}
          </SubMenu>
        )
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
      )
    }
  })
}

export const getMenuDefaultKeyByPath = (routes = config): menuDefaultType => {
  let idStr = ''
  let pIdStr = ''
  const curPath =
    '/' +
    window.location.pathname
      .split('/')
      .slice(4)
      .join('/')

  if (curPath === '/') {
    const pIdStr = config[0].id.toString()
    const idStr = config[0].childRoute.length ? config[0].childRoute[0].id.toString : config[0].id.toString()
    menuDefaultKeys = {
      defaultOpenKeys: [pIdStr],
      defaultSelectedKeys: [pIdStr, idStr],
    }
  } else {
    const path_pattern = curPath.replace(/\//g, '\\/').replace(/[0-9]+/g, ':[a-z]+')
    const path_regex = new RegExp(path_pattern)

    routes.forEach(item => {
      if (item.hideSubMenu) {
        idStr = item.id.toString()
        pIdStr = idStr.substring(0, 3)
        if (curPath.includes(item.path)) {
          menuDefaultKeys = {
            defaultOpenKeys: [pIdStr],
            defaultSelectedKeys: [pIdStr, idStr],
          }
        }
      } else {
        if (item.childRoute && item.childRoute.length) {
          getMenuDefaultKeyByPath(item.childRoute)
        }

        if (path_regex.test(item.path)) {
          if (item.hideMenu) {
            const selectedSubMenu = routes.find(item => !item.hideMenu)
            idStr = selectedSubMenu.id.toString()
          } else {
            idStr = item.id.toString()
          }

          pIdStr = idStr.substring(0, 3)

          menuDefaultKeys = {
            defaultOpenKeys: [pIdStr],
            defaultSelectedKeys: [pIdStr, idStr],
          }
        }
      }
    })
  }
  return menuDefaultKeys
}

/**
 * 获取路由结构
 */
// export const renderRouter = (configs: RouteItem[]) => {
//   let routes = [];
//   configs.forEach((item: RouteItem) => {
//     const { path, title, component, exact = true, noAuth, children = [], ...rest } = item;
//     const routPath = BASE_PATH + path;
//     let route = null;

//     if (noAuth) {
//       route = <Route key={routPath} exact={exact} path={path} component={component} />;
//     } else {
//       route = <AuthorizedRoute key={path} exact path={path} component={component} {...rest} />;
//     }

//     route && routes.push(route);

//     //遍历子路由
//     if (children && children.length) {
//       const subRoutes = renderRouter(children);
//       routes = routes.concat(subRoutes);
//     }
//   });

//   return routes;
// };

/**
 * 获取路由结构(没有权限控制)
 */
export const renderRouter = (configs: IRouteItem[]) => {
  let routes = []
  configs.forEach((item: IRouteItem) => {
    const { path, component, childRoute = [], redirect } = item
    const route = (
      <Route key={path} exact path={path} component={component}>
        {redirect ? <Redirect to={redirect} /> : null}
      </Route>
    )
    route && routes.push(route)
    //遍历子路由
    if (childRoute && childRoute.length) {
      const subRoutes = renderRouter(childRoute)
      routes = routes.concat(subRoutes)
    }
  })

  return routes
}

/**
 * 获取路由结构(有权限控制)
 */
export const getAuthorizedRoutes = (configs: IRouteItem[]) => {
  let routes = []
  configs.forEach((item: IRouteItem) => {
    const { path, noAuth = false, childRoute, redirect, ...rest } = item
    const route = noAuth ? (
      <Route key={path} exact path={path} childRoute={childRoute} {...rest}>
        {redirect ? <Redirect to={redirect} /> : null}
      </Route>
    ) : (
      <AuthorizedRoute key={path} exact path={path} childRoute={childRoute} {...rest} />
    )
    route && routes.push(route)
    //遍历子路由
    if (childRoute && childRoute.length) {
      const subRoutes = getAuthorizedRoutes(childRoute)
      routes = routes.concat(subRoutes)
    }
  })
  return routes
}

export const getBreadcrumbRoutes = () => {
  const menu = getMenuByPath()
  const routes = []
  const _getRoutes = (menu: IRouteItem) => {
    const { path, title, childRoute } = menu
    routes.push({
      path,
      name: title,
    })
    if (childRoute && childRoute.length) {
      childRoute.forEach(item => {
        _getRoutes(item)
      })
    }
  }
  _getRoutes(menu)
  return routes
}

// 根据当前登录用户的scope获取所有具有权限的路由
export const getPermRoutes = () => {
  let permissionRoutes = []
  authStore.permissions.forEach((scope: string) => {
    const name = scope.substr(scope.indexOf('_') + 1)
    permissionRoutes = permissionRoutes.concat(permsConfig[name])
  })

  permissionRoutes = Array.from(new Set(permissionRoutes))
  return permissionRoutes
}

// 根据当前路由检查是否有权限
export const checkPermissionByPath = (path: string) => {
  const permissionRoutes = getPermRoutes()
  const hasPermission = permissionRoutes.some(route => {
    if (!route) return false
    const pathArr = path.split('/')
    const escapePath = path.replace(/\//g, '\\/')
    const lastStr = pathArr[pathArr.length - 1]
    let matchStr = ''

    // kcid 匹配
    if (~lastStr.indexOf('-')) {
      matchStr = escapePath.replace(lastStr, ':[a-z]+')
    } else {
      matchStr = escapePath.replace(/\d+/, ':[a-z]+')
    }

    const regex = new RegExp(matchStr)
    return regex.test(route)
  })
  return !!hasPermission
}
