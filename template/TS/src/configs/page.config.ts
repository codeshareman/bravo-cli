import { lazy } from "react";

// 组件
import BundleCompo from "../HOC/BundleCompo";

// 页面
const Dashboard = lazy(() => import("../pages/dashboard"));
const Form = lazy(() => import("../pages/form"));

const MainPages = {
  Dashboard: BundleCompo(Dashboard),
  Form: BundleCompo(Form)
};

export { MainPages };
