import { BrcoccoliChart, BroccoliForm, ProfitCenter } from "./component.config";
import { APP_CONFIG } from "@SRC/utils/constant";

const { registerName } = APP_CONFIG;
const BASE_PATH = `/wws-b/v2/${registerName}`;
const MENU = [
  {
    id: 1,
    sort: 1,
    title: "",
    name: "entry",
    path: "/",
    redirectPath: "/mine"
  },
  {
    id: 2,
    sort: 2,
    title: "收益中心",
    name: "profit_center",
    iconClass: 'money-collect',
    isExact: true,
    path: "/mine",
    component: ProfitCenter.MyProfit,
    children: [
      {
        id: 2001,
        sort: 1,
        title: "我的收益",
        name: "my_profit",
        path: "/mine",
        component: ProfitCenter.MyProfit
      }
    ]
  }
];

export { BASE_PATH, MENU };
