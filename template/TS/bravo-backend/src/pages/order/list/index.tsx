import React, { Component } from 'react';
import Query from './query';
import { Divider, Table, message } from 'antd';

import './index.scss';
import API from '@/api';
import { CustBreadcrumb } from '@/components/CustComponents';
import { OrderQuery, OrderState } from '@/client/portal/service/oss/OrderService';
import { AJAX_STATUS } from '@/shared/common/constants';
import { getCityInfoByCode, getLocalePrice, getTimestamp, limitWord } from '@/shared/common/utils';
import { withRouter, RouteComponentProps } from 'react-router-dom';

type P = RouteComponentProps & {};
type S = {
  total: number;
  loading: boolean;
  dataSource: any[];
  searchParams: OrderQuery;
};

class RealOrder extends Component<P, S> {
  state = {
    total: 0,
    loading: false,
    dataSource: [],
    searchParams: {
      state: OrderState.WAIT_DELIVER,
      startDate: null,
      endDate: null,
      orderNo: '',
      agentDistrict: '',
      companyName: '',
      pageNum: 1,
      pageSize: 10,
    },
  };

  componentDidMount() {
    this.initialRequest();
  }

  initialRequest = () => {
    const { searchParams } = this.state;
    this.getOrderList(searchParams);
  };

  onSubmit = (params: any) => {
    const { searchParams } = this.state;
    const validTime = params.date;
    const agencyArea = params.agencyArea;
    const startDate = validTime && validTime.length > 0 ? getTimestamp(validTime[0]) : null;
    const endDate = validTime && validTime.length > 0 ? getTimestamp(validTime[1]) : null;
    const queryParams = {
      startDate,
      endDate,
      state: params.state,
      orderNo: params.orderNo || '',
      agentDistrict: agencyArea && agencyArea.length > 0 ? agencyArea[0].code : '',
      companyName: params.companyName || '',
      pageNum: 1,
      pageSize: searchParams.pageSize
    };
    this.getOrderList(queryParams);
  };

  getOrderList = async (params: OrderQuery) => {
    this.setState({
      dataSource: [],
      loading: true,
    });
    try {
      const res = await API.order.list(params);
      if (res.code === AJAX_STATUS.SUCCESS) {
        const resData = res.data;
        this.setState({
          dataSource: resData.list,
          total: resData.total,
          loading: false,
          searchParams: {
            ...params,
            pageNum: resData.pageNum,
          },
        });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  handleDetails = (id: number) => {
    this.props.history.push(`/order/physical/detail/${id}`);
  };

  getOrderState = (state: OrderState) => {
    switch (state) {
      case OrderState.COMPLETE:
        return '已完成';
      case OrderState.WAIT_DELIVER:
        return '待发货';
      case OrderState.WAIT_RECEIVE:
        return '待收货';
    }
  };

  getTableProps = () => {
    const { dataSource } = this.state;
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 260,
        render: (orderNo: string) => {
          return orderNo ? limitWord(orderNo, 30) : '';
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 180,
        align: 'center',
      },
      {
        title: '完成时间',
        dataIndex: 'completeTime',
        key: 'completeTime',
        width: 180,
        align: 'center',
        render: completedTime => {
          return completedTime || '无';
        },
      },
      {
        title: '企业/公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 180,
        render: companyName => {
          return companyName ? limitWord(companyName, 28) : '';
        },
      },
      {
        title: '代理地区',
        dataIndex: 'agentDistrict',
        key: 'agentDistrict',
        width: 120,
        align: 'center',
        render(codeStr: string) {
          const city = codeStr ? getCityInfoByCode(codeStr).name : '';
          return city;
        },
      },
      {
        title: '货品种类',
        dataIndex: 'productTypeCount',
        key: 'productTypeCount',
        align: 'center',
        width: 120,
      },
      {
        title: '货品数量',
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
        align: 'center',
        width: 120,
      },
      {
        title: '订单金额',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        width: 120,
        align: 'center',
        render: (price: string) => {
          const priceStr = String(price);
          return getLocalePrice(priceStr);
        },
      },
      {
        title: '订单状态',
        dataIndex: 'state',
        key: 'state',
        width: 120,
        align: 'center',
        render: (state: OrderState) => {
          return this.getOrderState(state);
        },
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        render: record => (
          <a
            onClick={() => {
              this.handleDetails(record.orderNo);
            }}
          >
            查看详情
          </a>
        ),
      },
    ];
    return { dataSource, columns, rowKey: 'id' };
  };

  render() {
    const { loading, total, searchParams } = this.state;
    const routes = [
      {
        path: '/order/physical/list',
        name: '订单管理',
      },
      {
        path: '',
        name: '实体订单',
      },
    ];
    return (
      <div className="real-order">
        <CustBreadcrumb
          className="real-order-details-breadcrumb"
          routes={routes}
          showCurrentPosition
        />
        <div className="content-view">
          <Query onSubmit={this.onSubmit} />
          <Divider />
          <Table
            {...this.getTableProps()}
            loading={{ spinning: loading, tip: '数据加载中...' }}
            scroll={{ x: 1300 }}
            pagination={{
              total,
              current: searchParams.pageNum,
              pageSize: searchParams.pageSize,
              onChange: pageNum => {
                const searchParams = {
                  ...this.state.searchParams,
                  pageNum,
                };
                this.getOrderList(searchParams);
                this.setState({
                  searchParams,
                });
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(RealOrder);
