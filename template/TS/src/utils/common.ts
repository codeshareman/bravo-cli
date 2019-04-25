import { BASE_PATH, MENU } from "../configs/router.config";
import { Menu } from "antd";

let menu = [];
const allRoutes = getAllRoutes();

/**
 * 获取第一级路由
 * @param {*} menu 路由菜单
 */
function getFirstLevelMenu() {
  const FirstMenu = [];
  MENU.map((item, index) => {
    let menuItem = {};
    if (item.component) {
      const { id, sort, title, name, path, component, iconClass } = item;
      menuItem = {
        id,
        sort,
        title,
        name,
        iconClass,
        path: `${BASE_PATH}${path}`,
        component
      };
    }
    FirstMenu.push(menuItem);
  });
  return FirstMenu;
}

/**
 * 获取sideMenu 二级菜单
 * @param {*} childName
 */
function getSubMenu(childName) {
  let subMenu = [];
  const subRoute = MENU.filter(item => {
    return item.name === childName && item.children;
  });
  if (subRoute.length > 0) {
    if (subRoute[0].hasOwnProperty("children")) {
      subMenu = subRoute[0].children.map((item, index) => {
        const { id, sort, title, name, path, component } = item;
        let subPath = `${BASE_PATH}${path}`;
        return { id, sort, title, name, path: subPath, component };
      });
    }
  }
  return subMenu;
}

/**
 * 获取SideMenu
 */
function getMenu(parent = MENU) {
  let menuData = [];
  parent.map((item, index) => {
    if (item.component) {
      const {
        id,
        sort,
        title,
        name,
        path,
        iconClass,
        component,
        children
      } = item;
      let parentData = {
        id,
        sort,
        title,
        name,
        iconClass,
        path: `${BASE_PATH}${path}`,
        component,
        children: []
      };
      if (item.children) {
        parentData.children = getSubMenu(item.name);
      }
      menuData.push(parentData);
    }
  });
  return menuData;
}

/**
 * 获取所有路由
 * @param {*} child
 */
function getAllRoutes(child = MENU) {
  child.map((item, index) => {
    if (item.children) {
      getAllRoutes(item.children);
    }
    const { id, sort, title, name, path, component, children } = item;
    let subPath = `${BASE_PATH}${path}`;
    const ProcessedItem = {
      id,
      sort,
      title,
      name,
      path: subPath,
      component,
      children
    };
    menu.push(ProcessedItem);
  });
  return menu;
}

/**
 * 获取页面路由（按菜单分组）
 */
function getPageRoutes(routeKey) {
  const pageRoutes = {
    user_management: [],
    component_lib: []
  };
  MENU.map((item, index) => {
    pageRoutes[item.name] = [];
    item.children.map((sItem, sIndex) => {
      allRoutes.map(cItem => {
        let idStr = JSON.stringify(cItem.id);
        if (+idStr.substring(0, 3) == sItem.id) {
          pageRoutes[item.name].push(cItem);
        }
      });
    });
  });
  return routeKey ? pageRoutes[routeKey] : pageRoutes;
}

export { getFirstLevelMenu, getMenu, getSubMenu, getAllRoutes, getPageRoutes };
