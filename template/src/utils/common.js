import { BASE_PATH, MENU } from "@SRC/configs/router.config";

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
    } else if (item.redirectPath) {
      const { id, sort, title, name, path, iconClass, redirectPath } = item;
      menuItem = {
        id,
        sort,
        title,
        name,
        iconClass: iconClass || '',
        path: `${BASE_PATH}${path}`,
        redirectPath: `${BASE_PATH}${redirectPath}`
      };
    }
    FirstMenu.push(menuItem);
  });
  return FirstMenu;
}

/**
 * 根据routeName获取路由
 * @param {*} menu 路由菜单
 * @param {*} childName 子页面名字
 */
function getSecondLevelMenu(childName) {
  let subMenu = [];
  const subRoute = MENU.filter(item => {
    return item.name === childName && item.children;
  });

  if (subRoute.length > 0) {
    if (subRoute[0].hasOwnProperty("children")) {
      subMenu = subRoute[0].children.map(item => {
        const { id, sort, title, name, path, component } = item;
        let subPath = `${BASE_PATH}${path}`;
        return { id, sort, title, name, path: subPath, component };
      });
    }
  }
  return subMenu;
}

/**
 * 获取所有路由
 */
function getMenu() {
  let menuData = [];
  MENU.map((item, index) => {
    if (item.component) {
      const { id, sort, title, name, path, iconClass, component, children } = item;
      let parent = {
        id,
        sort,
        title,
        name,
        iconClass,
        path: `${BASE_PATH}${path}`,
        component
      };
      if (item.children) {
        parent.children = getSecondLevelMenu(item.name);
      }
      menuData.push(parent);
    }
  });
  return menuData;
}

export { getFirstLevelMenu, getSecondLevelMenu, getMenu };
