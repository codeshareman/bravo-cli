import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { message, ConfigProvider } from "antd";
import { Provider } from "mobx-react";
import store from "@/models";
import * as Sentry from "@sentry/browser";
import MainLayout from "./layout";
import { MainRoutes, noMenuRoutes } from "./router";
//import ExceptionRoute from "./router/ExceptionRoute";
import Page404 from "@/pages/exception/404";
import { BASE_PATH } from "@/shared/common/constants";
import { getEnv } from "@/shared/common/utils";
import zh_CN from "antd/lib/locale/zh_CN";
import "@/assets/css/app.scss";

// 当前环境
const env = getEnv();

// sentry初始化
function initSentry() {
  env === "prod" &&
    Sentry.init({
      dsn: "https://01281db7c7034cc29d5df58b0619720b@websentry.ximalaya.com/67"
    });
}

// 设置消息提示的数量
message.config({
  maxCount: 3
});

initSentry();

export default class App extends Component {
  componentDidMount() {}

  componentDidCatch(error: object) {
    env === "prod" && Sentry.captureException(error);
  }

  render() {
    return (
      <div className="page-container">
        <Provider {...store}>
          <ConfigProvider locale={zh_CN}>
            <Router basename={BASE_PATH}>
              <Switch>
                {noMenuRoutes}
                {/* <MainLayout>{MainRoutes}</MainLayout> */}
                {MainRoutes}
                {/* <ExceptionRoute /> */}
                {/* <Route path="/exception/403" component={Page403} /> */}
                <Route component={Page404} />
              </Switch>
            </Router>
          </ConfigProvider>
        </Provider>
      </div>
    );
  }
}
