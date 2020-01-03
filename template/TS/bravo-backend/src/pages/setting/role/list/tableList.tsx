import React, { Component } from 'react';
import { Table } from 'antd';

import './index.scss';
import PriceModal from '@/components/PriceModal';

type P = {};
type S = {
  visible: boolean;
  listDataSource: Array<any>;
  productId: string;
};

class TableList extends Component<P, S> {
  readonly state: S = {
    visible: false,
    listDataSource: [
      {
        uid: 321933,
        userName: 'captain',
        realName: '路飞',
        roleName: '服务商',
        area: '上海、成都',
        createAt: Date.now(),
        updateAt: Date.now(),
      },
      {
        uid: 321766,
        userName: 'captain',
        realName: '路飞',
        roleName: '服务商',
        area: '上海、成都',
        createAt: Date.now(),
        updateAt: Date.now(),
      },
    ],
    productId: '',
  };

  showSpuModal = row => {
    this.setState({
      visible: true,
      productId: row.productInfo.num,
    });
  };

  handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      visible: false,
    });
  };

  // 取消设置特殊价
  cancelSpecialPrice = row => {};

  render() {
    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '真实姓名',
        dataIndex: 'realName',
        key: 'realName',
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
      },
      {
        title: '管辖地区',
        dataIndex: 'area',
        key: 'area',
      },
      {
        title: '创建时间',
        dataIndex: 'createAt',
        key: 'createAt',
      },
      {
        title: '更新时间',
        dataIndex: 'updateAt',
        key: 'updateAt',
      },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        render: (val, row, index) => {
          return (
            <>
              <a style={{ marginRight: 10 }}>修改</a>
              <a style={{ marginRight: 10 }}>清空角色</a>
              <a>管辖地区</a>
            </>
          );
        },
      },
    ];

    return (
      <div>
        <Table
          className="table-list"
          dataSource={this.state.listDataSource}
          columns={columns}
          rowKey="uid"
        />
      </div>
    );
  }
}

export default TableList;
