import React, { Component, lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import reducer from "@/store/model";
import rootSaga from "@/store/saga";

// 组件
import IndexComponent from "@/routes/Index";
const BroccoliChart = lazy(() => import("@/pages/BroccoliChart"))

// 动态导入组件
function AsynComponent(Compo) {
  return class extends Component {
    render() {
      return (
        <div>
          <Suspense fallback={<div>loading...</div>}>
            <Compo />
          </Suspense>
        </div>
      );
    }
  };
}
// redux
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(function * (){
  yield rootSaga()
});

class Index extends Component {
  render() {
    return (
      <div className="app-container">
        <Provider store={store}>
          <BrowserRouter>
            <IndexComponent basename="wws-platform">
              <Switch>
                <Route exact path="/" component={AsynComponent(BroccoliChart)} />
                <Route exact path="/broccoli" component={AsynComponent(BroccoliChart)} />
              </Switch>
            </IndexComponent>
          </BrowserRouter>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById("root"));
