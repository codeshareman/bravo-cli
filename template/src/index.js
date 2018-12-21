// 库
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Plugins } from '@xmly/voi'

// 本地文件
import reducer from "@SRC/store/model";
import rootSaga from "@SRC/store/saga";
import { getFirstLevelMenu, getSecondLevelMenu } from "@SRC/utils/common";
import { BASE_PATH } from "@SRC/configs/router.config";
import { APP_CONFIG } from "@SRC/utils/constant";

import '@SRC/assets/css/theme.scss'
import '@SRC/assets/css/app.scss'


// 设置appName
const { registerName } = APP_CONFIG
const { BaseEffect } =  Plugins

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
  tempRoute.push(<Redirect key={lastIndex} to={`${BASE_PATH}/`} />);
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
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(function*() {
  yield rootSaga();
});

class Index extends Component {
  render() {
    return (
      <div className="app-container">
        <Provider store={store}>
          <BrowserRouter>

            {/* 开发版 */}
            {/* <IndexComponent>
              <EntryRoute />
            </IndexComponent> */}

            {/* 提测版 */}
            <BaseEffect appName={registerName}>
              <EntryRoute />
            </BaseEffect>
          </BrowserRouter>
        </Provider>
      </div>
    );
  }
}
const registParams = {
  Children: Index
};
window.voi.regist(registerName, registParams);

ReactDOM.render(<Index />, document.getElementById("root"));
