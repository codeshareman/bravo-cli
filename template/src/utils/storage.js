/**
 *  localstorage 管理
 */
const storage = new Object();
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
  }
});

export default storage;
