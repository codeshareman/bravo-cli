import React, { Component } from 'react';
import { Divider } from 'antd';

import './index.scss';
import Query from './query';
import TableList from './tableList';
import { CustBreadcrumb } from '@/components/CustComponents';

type P = {};
type S = {};

class FeatureManage extends Component<P, S> {
  render() {
    const routes = [
      { path: '', name: '设置' },
      { path: '', name: '功能管理' },
    ];
    return (
      <div className="price-setting">
        <CustBreadcrumb routes={routes} showCurrentPosition></CustBreadcrumb>
        <h2>功能管理</h2>
        <Query />
        <Divider />
        <TableList />
      </div>
    );
  }
}

export default FeatureManage;
