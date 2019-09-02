import React, { Component } from "react";
import Query from "./Query";
import Board from "../../components/board";
import { Table, message, Typography, Tooltip } from "antd";
import { MainContent } from "@/layout";
import Title from "../../components/title";
import SERVICE from "@/api";
import { FilterParams } from "@/types/agent";
import { AJAX_STATUS, BASE_PATH, IncomeDetailType } from "@/utils/constant";
import "./index.scss";
import { withRouter, RouteComponentProps } from "react-router-dom";
import moment from "moment";
import { PaginationProps } from "antd/lib/pagination";
import { TBoardItem } from "../../components/board/BoardItem";

type routeParams = {
  id?: string;
};
type P = RouteComponentProps<routeParams> & {
  filterParams: FilterParams;
};
type S = {
  dataSource: any[]; //表单数据
  total: number; //总条数
  totalAmount: number | string; //总金额
  searchParams: any; //查询条件
  pagination: PaginationProps; //分页信息
  detailsTitle: string; //详情页标题
  boardData: TBoardItem[]; //board数据
  defaultDate: any;
};

const initPage = {
  pageIndex: 1,
  pageSize: 10
};

const { Text } = Typography;
class Details extends Component<P, S> {
  state = {
    total: 0,
    totalAmount: "",
    dataSource: [],
    searchParams: {},
    pagination: {},
    detailsTitle: "",
    boardData: [],
    defaultDate: null
  };

  componentWillMount() {
    const { state } = this.props.location;
    if (!state) {
      message.error("无效访问");
      this.props.history.push(`${BASE_PATH}/income/sell`);
    } else {
      this.initQuery();
    }
  }

  initQuery = () => {
    const { state } = this.props.location;
    const { id } = this.props.match.params;
    if (state) {
      const { businessType, params, title } = state;
      const queryparams = Object.assign({}, params, initPage);
      this.setState({
        detailsTitle: title,
        defaultDate: moment(new Date(`${params.year}-${params.month}`))
      });
      this.query({
        businessType,
        params: Object.assign(queryparams, { businessId: id })
      });
    }
  };

  handleSubmit = (values = {}) => {
    const { state } = this.props.location;
    const { id } = this.props.match.params;
    if (state) {
      const { businessType, params } = state;
      const temp = Object.assign({}, params, values);
      const queryparams = Object.assign({}, temp, initPage);
      this.query({
        businessType,
        params: Object.assign(queryparams, { businessId: id })
      });
    }
  };

  query = (filterParams: FilterParams) => {
    const { state } = this.props.location;
    const { type } = state;
    if (IncomeDetailType.AGENT === type) {
      //子级分销商带来的收益
      this.queryChildSaleRevenueDetail(filterParams);
      //this.getTotalSaleRevenueByBusinessType(filterParams);
    } else if (IncomeDetailType.MINE === type) {
      //自销带来的收益
      this.querySelfSaleRevenueDetail(filterParams);
    } else if (IncomeDetailType.LOCK === type) {
      //锁订单收益详情
      this.queryLockDetails(filterParams);
    } else {
      console.log("无效访问");
    }
  };

  //锁订单收益详情
  queryLockDetails = async (filterParams: FilterParams) => {
    const res = await SERVICE.revenue.queryLockOrderRevenueDetail(
      filterParams.businessType,
      filterParams.params
    );
    if (res.code === AJAX_STATUS.SUCCESS) {
      console.log({ res });
    } else {
      message.error(res.message);
    }
  };

  // 分页查看图书馆维度的详细销售收益数据-子级分销商带来的收益(agent)
  queryChildSaleRevenueDetail = async (filterParams: FilterParams) => {
    const res = await SERVICE.revenue.queryChildSaleRevenueDetail(
      filterParams.businessType,
      filterParams.params
    );

    if (res.code === AJAX_STATUS.SUCCESS) {
      const {
        data = [],
        total = 0,
        totalAmount = 0,
        pageIndex = 1,
        pageSize = 10
      } = res.data;
      const pagination = {
        total,
        current: pageIndex,
        pageSize,
        onChange: (page: number) => {
          filterParams.params.pageIndex = page;
          this.queryChildSaleRevenueDetail(filterParams);
        }
      };
      this.setState({
        dataSource: data,
        total,
        totalAmount,
        pagination,
        boardData: [
          {
            title: "收益(元)",
            content: totalAmount
          }
        ]
      });
    } else {
      message.error(res.message);
    }
  };

  // 分页查看图书馆维度的详细销售收益数据-自销带来的收益(mine)
  querySelfSaleRevenueDetail = async (filterParams: FilterParams) => {
    const res = await SERVICE.revenue.querySelfSaleRevenueDetail(
      filterParams.businessType,
      filterParams.params
    );
    if (res.code === AJAX_STATUS.SUCCESS) {
      const {
        data = [],
        total = 0,
        totalAmount = 0,
        pageIndex = 1,
        pageSize = 10
      } = res.data;
      const pagination = {
        total,
        current: pageIndex,
        pageSize,
        onChange: (page: number) => {
          filterParams.params.pageIndex = page;
          this.querySelfSaleRevenueDetail(filterParams);
        }
      };
      this.setState({
        dataSource: data,
        total,
        totalAmount,
        pagination,
        boardData: [
          {
            title: "收益(元)",
            content: totalAmount
          }
        ]
      });
    } else {
      message.error(res.message);
    }
  };

  getTableProps = () => {
    const { dataSource, pagination } = this.state;
    const columns = [
      {
        title: "交易时间",
        dataIndex: "createAt",
        key: "createAt"
      },
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
        title: "付费类型",
        dataIndex: "",
        key: "payType",
        render: () => <span>付费</span>
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
        title: "订单金额(元)",
        dataIndex: "totalAmount",
        key: "totalAmount"
      },
      {
        title: "手续费(元)",
        dataIndex: "channelAmount",
        key: "channelAmount"
      },
      {
        title: "分成比例",
        dataIndex: "ratio",
        key: "ratio"
      },
      {
        title: "销售收益(元)",
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
      rowKey: "id",
      dataSource,
      columns,
      pagination
    };
  };

  render() {
    const { total, defaultDate, detailsTitle = "", boardData } = this.state;
    return (
      <MainContent
        pageHeader={{
          title: detailsTitle
        }}
      >
        <Title title={detailsTitle} />
        <Query defaultDate={defaultDate} onSubmit={this.handleSubmit} />
        <Board dataSource={boardData} />
        <Title title="收入明细" />
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

export default withRouter(Details);
