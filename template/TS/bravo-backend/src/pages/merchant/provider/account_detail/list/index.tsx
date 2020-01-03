import React, { Component } from 'react';
import { Divider, Table, message } from 'antd';

import './index.scss';
import API from '@/api';
import Query from './query';
import Regex from '@/shared/common/regex';
import { CustBreadcrumb } from '@/components/CustComponents';
import {
  getTimestamp,
  formatTimeByTimestamp,
  getDisplayTime,
  getLocalePrice,
} from '@/shared/common/utils';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { DealStatementQueryRequest } from '@/client/portal/service/oss/AccountService';
import { AJAX_STATUS } from '@/shared/common/constants';

type P = RouteComponentProps<{ uid: string }> & {};
type S = {
  loading: boolean;
  total: number;
  searchParams: DealStatementQueryRequest;
  dataSource: Array<any>;
};

class AccountManage extends Component<P, S> {
  state: S = {
    loading: true,
    total: 0,
    dataSource: [],
    searchParams: {
      tradeTimeStart: null,
      tradeTimeEnd: null,
      tradeType: null,
      trxNo: null,
      uid: null,
      pageIndex: 1,
      pageSize: 10,
    },
  };

  componentDidMount() {
    this.initialRequest();
  }

  initialRequest = () => {
    const {
      match: { params },
    } = this.props;
    const uid = +params.uid;
    const searchParams = {
      ...this.state.searchParams,
      uid,
    };
    this.getDealStatement(searchParams);
  };

  onSubmit = values => {
    const {
      match: { params },
    } = this.props;
    const uid = +params.uid;
    const tradeTime = values.tradeTime;

    const searchParams = {
      trxNo: values.trxNo || null,
      tradeType: values.tradeType || null,
      tradeTimeStart: tradeTime && tradeTime.length > 0 ? getTimestamp(tradeTime[0]) : null,
      tradeTimeEnd: tradeTime && tradeTime.length > 0 ? getTimestamp(tradeTime[1]) : null,
      pageIndex: 1,
      pageSize: 10,
      uid,
    };

    this.getDealStatement(searchParams);
  };

  getDealStatement = async (params: DealStatementQueryRequest) => {
    this.setState({
      loading: true,
      dataSource: [],
    });
    try {
      const res = await API.account.queryDealStatement(params);
      const resData = res.data;
      const dealList = resData.data;
      if (res.code === AJAX_STATUS.SUCCESS) {
        this.setState({
          loading: false,
          dataSource: dealList,
          searchParams: {
            ...params,
            pageIndex: resData.current,
          },
          total: resData.total,
        });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // 渲染交易类型
  renderNameByTradeType = (tradeType: number) => {
    const tradeTypeList = [
      {
        value: 1,
        name: '充值',
      },
      {
        value: 2,
        name: '提现',
      },
      {
        value: 3,
        name: '采购',
      },
      {
        value: 4,
        name: '转入',
      },
      {
        value: 5,
        name: '转出',
      },
      {
        value: 6,
        name: '提现手续费',
      },
    ];
    const colItem = tradeTypeList.find(item => item.value === tradeType);
    return colItem.name || '';
  };

  getTableProps = () => {
    const { dataSource } = this.state;
    const columns = [
      {
        title: '交易流水号',
        dataIndex: 'trxNo',
        key: 'trxNo',
      },
      {
        title: '收入',
        dataIndex: 'income',
        key: 'income',
        // align: 'center',
        render: (price: string) => {
          return <span className="txt-income"> {getLocalePrice(price)} </span>;
        },
      },
      {
        title: '支出',
        dataIndex: 'expense',
        key: 'expense',
        // align: 'center',
        render: (price: string) => {
          return <span className="txt-expenditure">{getLocalePrice(price)}</span>;
        },
      },
      {
        title: '账户总金额',
        dataIndex: 'balance',
        key: 'balance',
        // align: 'center',
        render: (price: string) => {
          return getLocalePrice(price);
        },
      },
      {
        title: '交易类型',
        dataIndex: 'tradeType',
        key: 'tradeType',
        // align: 'center',
        render: (tradeType: number) => {
          return this.renderNameByTradeType(tradeType);
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '交易时间',
        dataIndex: 'tradeTime',
        key: 'tradeTime',
        render: timestamp => {
          return getDisplayTime(formatTimeByTimestamp(timestamp));
        },
      },
    ];
    return { columns, dataSource, rowKey: 'trxNo' };
  };

  render() {
    const { loading, searchParams, total } = this.state;
    const routes = [
      { path: '/business/provider', name: '商户管理' },
      { path: '/business/provider', name: '商户列表' },
      { path: '', name: '账户明细' },
    ];
    return (
      <div className="account-detail">
        <CustBreadcrumb routes={routes} showCurrentPosition></CustBreadcrumb>
        <h2>账户明细</h2>
        <Query onSubmit={this.onSubmit} />
        <Divider />
        <div className="stastic">
          共 <span className="total">{this.state.total} </span>条数据
        </div>
        <Table
          loading={{ spinning: loading, tip: '数据加载中...' }}
          {...this.getTableProps()}
          className="table-list"
          pagination={{
            total,
            current: searchParams.pageIndex,
            pageSize: searchParams.pageSize,
            onChange: pageIndex => {
              const searchParams = {
                ...this.state.searchParams,
                pageIndex,
              };
              this.getDealStatement(searchParams);
              this.setState({
                searchParams,
              });
            },
          }}
        />
        {/* <PriceModal
          productId={this.state.productId}
          visible={this.state.visible}
          onOk={this.handleConfirm}
          onCancel={this.handleCancel}
          destroyOnClose
        /> */}
      </div>
    );
  }
}

export default withRouter(AccountManage);
