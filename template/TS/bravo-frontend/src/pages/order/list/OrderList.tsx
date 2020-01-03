import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Table, message, Statistic } from "antd";
import { PaginationConfig } from "antd/lib/pagination";
import Query from "./query";
import { OrderItem, OrderState } from "@/api/service/OrderService";
import { HTTP_STATUS, OrderStateText } from "@/shared/common/constants";
import { TabPaneKey } from "./index";

import Api from "@/api";

type P = RouteComponentProps & {
  tabkey: TabPaneKey;
};

type S = {
  dataSource: OrderItem[];
  queryParams: object;
  pagination: PaginationConfig;
  total: number;
  loading: boolean;
};

const Init_Page = {
  // 页号
  pageNum: 1,
  // 每页数量
  pageSize: 10
};

class OrderList extends Component<P, S> {
  state = {
    dataSource: [],
    queryParams: {},
    pagination: {},
    total: 0,
    loading: false
  };

  componentDidMount() {
    this.initQuery();
    this.setState({
      dataSource: []
    });
  }

  initQuery = () => {
    const { tabkey } = this.props;
    const params = { ...Init_Page };
    if (TabPaneKey.ALL !== tabkey) {
      Object.assign(params, { state: tabkey });
    }
    this.getList(params);
  };

  getList = async params => {
    const res = await Api.order.list(params);
    console.log({ res });
    if (HTTP_STATUS.SUCCESSS === res.code) {
      const {
        total = 0,
        pageSize = Init_Page.pageSize,
        pageNum = Init_Page.pageNum
      } = res.data;
      this.setState({
        dataSource: res.data.list || [],
        queryParams: params,
        pagination: {
          total,
          current: pageNum,
          pageSize,
          onChange: (pageIndex, pageSize) => {
            this.getList(Object.assign({}, params, { pageIndex, pageSize }));
          },
          onShowSizeChange: (pageIndex, pageSize) => {
            this.getList(Object.assign({}, params, { pageIndex, pageSize }));
          }
        }
      });
    } else {
      message.error(res.message);
    }
  };

  handelToDetail = row => {
    const { orderNo } = row;
    this.props.history.push({
      pathname: `/order/details/${orderNo}`
    });
  };

  handleSubmit = values => {
    const { tabkey } = this.props;
    if (values.orderCreateTime && values.orderCreateTime.length) {
      values.startDate = +values.orderCreateTime[0];
      values.endDate = +values.orderCreateTime[1];
      delete values.orderCreateTime;
    }
    if (TabPaneKey.ALL !== tabkey) {
      Object.assign(values, { state: tabkey });
    }
    this.getList(Object.assign(values, Init_Page));
  };

  getTableProps = () => {
    const { dataSource, pagination } = this.state;
    const columns = [
      {
        key: "orderNo",
        dataIndex: "orderNo",
        title: "订单号"
      },
      {
        key: "createTime",
        dataIndex: "createTime",
        title: "订单生成时间"
      },
      {
        key: "productTypeCount",
        dataIndex: "productTypeCount",
        title: "商品种类"
      },
      {
        key: "totalQuantity",
        dataIndex: "totalQuantity",
        title: "商品数量",
        render: (count = 0) => (
          <Statistic valueStyle={{ fontSize: 12 }} value={count} />
        )
      },
      {
        key: "totalAmount",
        dataIndex: "totalAmount",
        title: "订单金额",
        render: (amount = 0) => (
          <Statistic valueStyle={{ fontSize: 12 }} prefix="¥" value={amount} />
        )
      },
      {
        key: "state",
        dataIndex: "state",
        title: "订单状态",
        render: text => {
          return (
            <span className={text === OrderState.COMPLETE ? "label-over" : ""}>
              {OrderStateText[text]}
            </span>
          );
        }
      },
      {
        key: "actions",
        dataIndex: "actions",
        title: "操作",
        render: (curVal, row) => {
          return (
            <>
              <a
                onClick={() => {
                  this.handelToDetail(row);
                }}
              >
                查看详情
              </a>
            </>
          );
        }
      }
    ];
    return {
      dataSource,
      columns,
      rowKey: "orderNo",
      pagination: {
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => {
          return <span>共{total}条记录</span>;
        }
      }
    };
  };

  render() {
    return (
      <div>
        <Query onSubmit={this.handleSubmit} />
        <Table className="order-table-list" {...this.getTableProps()} />
      </div>
    );
  }
}

export default withRouter(OrderList);
