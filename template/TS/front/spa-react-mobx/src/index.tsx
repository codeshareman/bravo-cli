// 库
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Helmet } from "react-helmet";

const render = C => {
  ReactDOM.render(
    <>
      <Helmet>
        <title>喜马拉雅商户平台</title>
        <script src="//s1.xmcdn.com/yx/common-sdk/last/lib/provinceCityDistrict.js"></script>
        <script src="//s1.xmcdn.com/yx/common-sdk/last/lib/city.js?v=1.0.0"></script>
      </Helmet>
      <C />
    </>,
    document.getElementById("root-app")
  );
};

//ReactDOM.render(<App />, document.getElementById("root-app"));

render(App);
