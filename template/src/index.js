import React, { Component, lazy, Suspense, PureComponent } from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import reducer from "@/store/model";
import rootSaga from "@/store/saga";
import { getFirstLevelMenu, getSecondLevelMenu } from "@/utils/common";
import { BASE_PATH } from "@/configs/router.config";

// 根组件
import IndexComponent from "@/routes/Index";


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
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(function*() {
  yield rootSaga();
});

class Index extends Component {
  render() {
    return (
      <div className="app-container">
        <Provider store={store}>
          <BrowserRouter>
            <IndexComponent>
              <EntryRoute />
            </IndexComponent>
          </BrowserRouter>
        </Provider>
      </div>
    );
  }
}
const registParams = {
  Children: Index
};
window.ws.regist("broccoli", registParams);

ReactDOM.render(<Index />, document.getElementById("root"));
