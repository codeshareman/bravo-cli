// 库
import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { BrowserRouter } from "react-router-dom";
import { message, LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";

// 本地文件
import reducer from "./store";
import { APP_CONFIG } from "@/utils/constant";

// 本地开发根组件
import PageLayout from "@/layout/PageLayout";

import "@/assets/css/theme.scss";
import "@/assets/css/app.scss";

// 设置appName
const { registerName } = APP_CONFIG;

message.config({
  maxCount: 5
});

// redux
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

class Index extends React.Component {
  render() {
    return (
      <div className="cps-data-center-container">
        <LocaleProvider locale={zh_CN}>
          <Provider store={store}>
            <BrowserRouter >
              <PageLayout isLocal={true}/>
            </BrowserRouter>
          </Provider>
        </LocaleProvider>
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
