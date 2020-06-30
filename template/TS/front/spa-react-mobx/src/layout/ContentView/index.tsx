import * as React from "react";
import { Row, Col } from "antd";

import SiderView from "../SiderView";
import "./index.scss";

type P = {};
type S = {};

// 主内容区域
class ContentView extends React.Component<P, S> {
  render() {
    return (
      <div className="content-wrapper">
        <SiderView />
        <div className="page-view">{this.props.children}</div>
      </div>
    );
  }
}

export default ContentView;
