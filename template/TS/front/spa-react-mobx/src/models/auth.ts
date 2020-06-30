import { observable, action, computed } from "mobx";
import config, { IRouteItem, permsConfig } from "@/router/config";

class Auth {
  @observable isInit = JSON.parse(sessionStorage.getItem("isInit")) ||false; //是否初始化并加载数据

  @observable perms: string[] = JSON.parse(sessionStorage.getItem("perms")) || [
    //"index"
  ];

  @computed get menu() {
    let menu = [];
    try {
      if (this.perms && this.perms.length) {
        let permsRoutes = [];
        this.perms.forEach(perm => {
          permsRoutes = permsRoutes.concat(permsConfig[perm] || []);
        });
        //数组去重
        permsRoutes = Array.from(new Set(permsRoutes));
        //菜单过滤
        //TODO 下级菜单 待优化
        menu = config.filter(i => {
          return i.path && !!permsRoutes.includes(i.path);
        });
      }
    } catch (error) {
      console.log({ error });
    }

    return menu;
  }

  @action setPerms = (perms: string[]) => {
    sessionStorage.setItem("perms", JSON.stringify(perms));
    this.perms = perms;
    if (!this.isInit) {
      this.setIsInit(true);
    }
  };

  @action setIsInit = (isInit: boolean) => {
    sessionStorage.setItem("isInit", JSON.stringify(isInit));
    this.isInit = isInit;
  };
}

export default new Auth();

export type IAuthStore = {
  isInit: boolean;
  perms: string[];
  menu: IRouteItem[];
  setPerms(perms: string[]);
  setIsInit(isInit: boolean);
};
