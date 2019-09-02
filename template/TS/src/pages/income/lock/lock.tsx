import React, { Component } from "react";
import SERVICE from "@/api";
import { MainContent } from "@/layout";
import Query from "../components/Query";
import Board from "../components/board";
import Title from "../components/title";
import DetailsQuery from "./DetailsQuery";
import { Table, message, Typography, Tooltip } from "antd";
import { PaginationProps } from "antd/lib/pagination";
import { AJAX_STATUS } from "@/utils/constant";
import { RevenueSummary } from "client/service/RevenueService";
import { TBoardItem } from "../components/board/BoardItem";
import { FilterParams } from "@/types/agent";

interface P {}
interface S {
  summaryQueryParams: FilterParams;
  dataSource: any[];
  boardData: TBoardItem[];
  total: number;
  pagination: PaginationProps;
  distName: string;
}

const initPage = {
  pageIndex: 1,
  pageSize: 10
};

const { Text } = Typography;
class Lock extends Component<P, S> {
  state = {
    summaryQueryParams: null,
    dataSource: [],
    boardData: [],
    total: 0,
    pagination: {},
    distName: ""
  };

  handleQuery = value => {
    const yearMonth = value
      ? {
          year: ~~value.yearMonth.format("YYYY"),
          month: ~~value.yearMonth.format("MM")
        }
      : null;
    const summaryQueryParams = {
      businessType: value.businessType,
      params: {
        ...yearMonth
      }
    };
    this.getLockOrderRevenueSummary(summaryQueryParams);
    this.queryLockOrderRevenueDetail(summaryQueryParams);
    this.setState({
      summaryQueryParams
    });
  };

  getLockOrderRevenueSummary = async params => {
    const res = await SERVICE.revenue.getLockOrderRevenueSummary(
      params.businessType,
      params.params
    );

    if (AJAX_STATUS.SUCCESS === res.code) {
      const revenueSummary: RevenueSummary = res.data;
      const list: TBoardItem[] = [
        {
          title: "锁订单收益(元）",
          content: revenueSummary.clearingAmount || 0
        },
        {
          title: "锁订单数量",
          content: revenueSummary.orderCount || 0
        },
        {
          title: "锁订单分成比例",
          content: revenueSummary.currentRatio || "10%"
        }
      ];

      this.setState({
        boardData: list,
        distName: revenueSummary.distName
      });
    } else {
      message.error(res.message);
    }
  };

  searchLockRevenueData = values => {
    const { summaryQueryParams } = this.state;
    const businessType = summaryQueryParams.businessType;
    const params = summaryQueryParams.params || {};
    this.queryLockOrderRevenueDetail({
      businessType,
      params: Object.assign({}, params, values, initPage)
    });
  };

  queryLockOrderRevenueDetail = async filterParams => {
    const res = await SERVICE.revenue.queryLockOrderRevenueDetail(
      filterParams.businessType,
      filterParams.params
    );
    if (AJAX_STATUS.SUCCESS === res.code) {
      const { total = 0 } = res.data;
      const pagination = {
        total,
        onChange: page => {
          const { businessType, params } = filterParams;
          const qyeryParams = Object.assign({}, params, initPage, {
            pageIndex: page
          });
          this.queryLockOrderRevenueDetail({
            businessType,
            params: qyeryParams
          });
        }
      };
      this.setState({
        total,
        pagination,
        dataSource: res.data.data || []
      });
    } else {
      message.error(res.message);
    }
  };

  getTableProps = () => {
    const { dataSource, pagination } = this.state;
    const columns = [
      {
        title: "订单号",
        dataIndex: "orderId",
        key: "orderId",
        render: text => (
          <Tooltip title={text}>
            <Text ellipsis style={{ width: 100 }}>
              {text}
            </Text>
          </Tooltip>
        )
      },
      {
        title: "交易时间",
        dataIndex: "createAt",
        key: "createAt"
      },
      {
        title: "购买用户",
        dataIndex: "buyerName",
        key: "buyerName"
      },
      {
        title: "商品名称",
        dataIndex: "productTitle",
        key: "productTitle"
      },
      {
        title: "订单金额（元）",
        dataIndex: "totalAmount",
        key: "totalAmount"
      },
      {
        title: "手续费（元）",
        dataIndex: "channelAmount",
        key: "channelAmount"
      },
      {
        title: "分成比例",
        dataIndex: "ratio",
        key: "ratio"
      },
      {
        title: "实际收入",
        dataIndex: "",
        key: "clearingAmount",
        render: record => (
          <span
            style={{
              color: record.orderStatus === "交易成功" ?  "green" : "red"
            }}
          >
            {record.clearingAmount}
          </span>
        )
      },
      {
        title: "状态",
        dataIndex: "orderStatus",
        key: "orderStatus"
      }
    ];
    return {
      rowKey: "orderId",
      dataSource,
      columns,
      pagination
    };
  };

  render() {
    const { boardData, total, distName } = this.state;
    return (
      <MainContent
        pageHeader={{
          title: `${distName}`,
          hidePageHeader:true
        }}
      >
        <Title title="收益概况" />
        <Query onSubmit={this.handleQuery} />
        <Board dataSource={boardData} />
        <Title title="锁订单收益明细" />
        <DetailsQuery onSubmit={this.searchLockRevenueData} />
        <section style={{ padding: "20px 0 5px" }}>
          <p>
            共找到<span style={{ color: "red" }}>{total}</span>笔数据
          </p>
        </section>
        <Table {...this.getTableProps()} />
      </MainContent>
    );
  }
}

export default Lock;
