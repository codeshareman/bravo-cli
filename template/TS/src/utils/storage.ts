/**
 *  localstorage 管理
 */

type IStorage = {
  user?: any;
  defaultKey?: any;
  currentPage?: any;
  currentStep?: any;
};

const storage: IStorage = new Object();

Object.defineProperties(storage, {
  user: {
    get() {},
    set(data) {}
  },
  defaultKey: {
    get() {
      return localStorage.getItem("defalutKey");
    },
    set(data) {
      localStorage.setItem("defalutKey", data);
    }
  },
  currentPage: {
    get() {
      return localStorage.getItem("currentPage") || 1;
    },
    set(data) {
      localStorage.setItem("currentPage", data);
    }
  },
  currentStep: {
    get() {
      return localStorage.getItem("currentStep") || 0;
    },
    set(data) {
      localStorage.setItem("currentStep", data);
    }
  }
});

export default storage;
