// 库
import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { message } from "antd";
import { Plugins } from "@xmly/voi";
//const { Plugins } = window.Voi;

// 本地文件
import reducer from "./store";
import { getFirstLevelMenu } from "./utils/common";
import { APP_CONFIG } from "./utils/constant";
//import "@xmly/voi/lib/css/theme.css";
import "@/assets/css/theme.scss";
import "@/assets/css/app.scss";

// 本地开发根组件
import LocalComponent from "./routes/local";

// 路由组件
import MainStage from "./routes/main";

// 设置appName
const { registerName } = APP_CONFIG;
const { BaseEffect } = Plugins;

message.config({
  maxCount: 1
});

// 入口路由
const EntryRoute = function() {
  const firstLevelMenu = getFirstLevelMenu();
  const lastIndex = firstLevelMenu.length + 1;
  const tempRoute = [];
  firstLevelMenu.map((item, index) => {
    if (item.component) {
      const { id, name, isExact, path, component } = item;
      tempRoute.push(
        <Route
          key={id}
          exact={true}
          path={path}
          name={name}
          component={component}
        />
      );
    } else if (item.redirectPath) {
      const { id, name, isExact, path, redirectPath } = item;
      tempRoute.push(
        <Route
          key={id}
          name={name}
          exact={true}
          path={path}
          render={() => <Redirect to={redirectPath} />}
        />
      );
    }
  });
  return (
    <Switch>
      {tempRoute.map((item, index) => {
        return item;
      })}
    </Switch>
  );
};

// redux
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

class Index extends React.Component {
  render() {
    const env = "locol"; //本地开发测试, 左侧有菜单栏
    return (
      <div className="cli-container">
        <Provider store={store}>
          <BrowserRouter>
            {env === "locol" ? (
              <LocalComponent>
                <EntryRoute />
                <MainStage />
              </LocalComponent>
            ) : (
              <BaseEffect appName={registerName}>
                <EntryRoute />
                <MainStage />
              </BaseEffect>
            )}
          </BrowserRouter>
        </Provider>
      </div>
    );
  }
}

const registParams = {
  Children: Index
};

declare let window: Window & {
  voi: any;
  Voi: any;
};
window.voi.regist(registerName, registParams);
ReactDOM.render(<Index />, document.getElementById("root"));
