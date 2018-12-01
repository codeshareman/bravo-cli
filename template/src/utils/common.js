import { BASE_PATH, MENU } from "@/configs/router.config";

/**
 * 获取第一级路由
 * @param {*} menu 路由菜单
 */
function getFirstLevelMenu() {
  const FirstMenu = [];
  MENU.map((item, index) => {
    let menuItem = {};
    if(item.component) {
        const { id, sort, title, name, path, component } = item;
        menuItem = { id, sort, title, name, path: `${BASE_PATH}${path}`, component };
    } else if(item.redirectPath){
        const { id, sort, title, name, path, redirectPath } = item;
        menuItem = { id, sort, title, name, path: `${BASE_PATH}${path}`, redirectPath: `${BASE_PATH}${redirectPath}` }
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
  const subRoute = MENU.filter(item => {
    return item.name === childName && item.children;
  });
  if (subRoute.length > 0) {
    if (subRoute[0].hasOwnProperty("children")) {
      subRoute[0].children.filter(item => item.path = `${BASE_PATH}${item.path}`)
      return subRoute[0].children;
    }
  } else {
    return subRoute;
  }
}

/**
 * 获取所有路由
 */
function getMenu() {
  return MENU;
}

export { getFirstLevelMenu, getSecondLevelMenu, getMenu };
