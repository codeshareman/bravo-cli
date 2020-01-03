import * as React from 'react';

import "./index.scss"
import { Layout } from 'antd';

type P = {};
type S = {};

// 底部样式
class FooterView extends React.Component<P, S> {
  render() {
    return (
      <div className="footer-wrapper">
        Copyright © 2012-2019 www.ximalaya.com lnc.ALL Rights Reserved 上海喜马拉雅网络科技有限公司
        版权所有
      </div>
    );
  }
}

export default FooterView;
