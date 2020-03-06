import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { message, ConfigProvider } from "antd";
import { Provider } from "mobx-react";
import * as store from "@/models";
import * as Sentry from "@sentry/browser";

import MainLayout from "@/layout";
import MainRoutes from "./router";

import { BASE_PATH } from "@/shared/common/constants";
import { getEnv } from "@/shared/common/utils";
import zh_CN from "antd/lib/locale/zh_CN";
import "@/assets/css/app.scss";
import Exception from "@/pages/exception";

// 当前环境
const env = getEnv();

// sentry初始化
function initSentry() {
  env === "prod" &&
    Sentry.init({
      dsn: "https://1dd94f76011b4f8dbad47c2ba842c965@websentry.ximalaya.com/50"
    });
}

// 设置消息提示的数量
message.config({
  maxCount: 2
});

initSentry();

export default class App extends Component {
  UNSAFE_componentWillMount() {
    if (window.merchant && window.merchant.permissions) {
      store.authStore.setPermission(window.merchant.permissions || []);
    }
  }

  componentDidCatch(error: object) {
    env === "prod" && Sentry.captureException(error);
  }

  render() {
    return (
      <div className="page-container">
        <Provider {...store}>
          <ConfigProvider locale={zh_CN}>
            <Router basename={BASE_PATH}>
              <MainLayout>
                <Switch>
                  {MainRoutes}
                  <Route component={Exception.page404} />
                </Switch>
              </MainLayout>
            </Router>
          </ConfigProvider>
        </Provider>
      </div>
    );
  }
}

declare let window: Window & {
  merchant: {
    userinfo: any;
    permissions: string[];
  };
};
