import * as React from 'react';
import { Row, Col } from 'antd';

import SiderView from '../SiderView';
import './index.scss';

type P = {};
type S = {};

// 主内容区域
class ContentView extends React.Component<P, S> {
  componentDidMount() {}

  render() {
    const leftCols = {
      xs: 4,
      sm: 4,
      md: 4,
      lg: 4,
      xl: 4,
      xxl: 3,
    };
    const rightCols = {
      xs: 20,
      sm: 20,
      md: 20,
      lg: 20,
      xl: 20,
      xxl: 21,
    };
    return (
      <div className="content-wrapper">
        {/* <Row gutter={16}> */}
          {/* <Col {...leftCols} style={{ paddingLeft: 0 }}> */}
            <SiderView />
          {/* </Col> */}
          {/* <Col {...rightCols}> */}
            <div className="page-view">{this.props.children}</div>
          {/* </Col> */}
        {/* </Row> */}
      </div>
    );
  }
}

export default ContentView;
