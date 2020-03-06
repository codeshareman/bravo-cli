import { observable, action } from "mobx";

class AuthStore {
  @observable permissions = [];

  @action setPermission(permissions: string[]) {
    this.permissions = permissions;
  }
}

export default new AuthStore();

export type IAuthStore = {
  permissions: string[];
  setPermission(permissions: string[]): void;
};
