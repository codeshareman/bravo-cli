import { MainPages } from "./page.config";
import { APP_CONFIG } from "../utils/constant";

const { registerName } = APP_CONFIG;
const BASE_PATH = `/wws-workbench/v1/${registerName}`;

const MENU = [
  {
    id: 118,
    sort: 1,
    title: "后端脚手架",
    name: "wws-cli",
    iconClass: "dashboard",
    path: "/",
    component: MainPages.Dashboard,
    children: [
      {
        id: 100,
        sort: 1,
        title: "仪表盘",
        iconClass: "dashboard",
        name: "dashboard",
        path: "/dashboard",
        component: MainPages.Dashboard,
        children: []
      },
      {
        id: 101,
        sort: 2,
        title: "表单",
        iconClass: "form",
        name: "form",
        path: "/form",
        component: MainPages.Form,
        children: []
      }
    ]
  }
];

export { BASE_PATH, MENU };
