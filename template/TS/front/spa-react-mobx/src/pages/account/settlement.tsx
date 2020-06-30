import React, { Component } from 'react';
import EditOrderList from '@/components/EditOrderList';

import './css/settlement.scss';

type P = {};
type S = {};

// 采购提交订单
class Settlement extends Component<P, S> {
  readonly state: S = {};

  componentDidMount() {}

  render() {
    return (
      <div className="shop-settlement">
        <EditOrderList />
      </div>
    );
  }
}

export default Settlement;
