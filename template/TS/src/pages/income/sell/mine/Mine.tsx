import React, { Component } from "react";

import SERVICE from "@/api";
import Query from "./Query";
import { Table, message } from "antd";
import {
  AJAX_STATUS,
  BASE_PATH,
  IncomeDetailType,
  PublishStatusText
} from "@/utils/constant";
import { FilterParams } from "@/types/agent";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { PaginationProps } from "antd/lib/pagination";
import { getAreaInfo } from "@/utils/Helper";

type P = RouteComponentProps & {
  filter: FilterParams;
};
type S = {
  total: number;
  totalAmount: string;
  dataSource: any[];
  pagination: PaginationProps;
  queryParams: any;
};

const initPage = {
  pageIndex: 1,
  pageSize: 10
};
class Mine extends Component<P, S> {
  state = {
    total: 0,
    totalAmount: "0",
    dataSource: [],
    pagination: {},
    queryParams: {}
  };

  componentDidMount() {
    this.initialSearch(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const preFilter = this.props.filter;
    const nextFilter = nextProps.filter;

    //如果父级条件有变化则重新查询
    if (
      preFilter.businessType !== nextFilter.businessType ||
      preFilter.params.month !== nextFilter.params.month ||
      preFilter.params.year !== nextFilter.params.year
    ) {
      this.initialSearch(nextProps);
    }
  }

  initialSearch = props => {
    const { filter } = props;
    const { businessType, params } = filter;
    const qyeryParams = Object.assign({}, params, initPage);
    this.querySelfSaleRevenueSummaryByBusinessType({
      businessType,
      params: qyeryParams
    });
  };

  handleSubmit = value => {
    this.query(value);
  };

  query = value => {
    const searchParams = {
      ...this.props.filter,
      params: {
        queryString: value.queryString,
        year: ~~this.props.filter.params.year,
        month: ~~this.props.filter.params.month
      }
    };

    this.querySelfSaleRevenueSummaryByBusinessType(searchParams);
  };

  // 根据业务id统计子级分销商带来的收益数据，如图书馆业务则根据图书馆ID统计
  querySelfSaleRevenueSummaryByBusinessType = async (filter: FilterParams) => {
    const res = await SERVICE.revenue.querySelfSaleRevenueSummaryByBusinessType(
      filter.businessType,
      filter.params
    );
    if (AJAX_STATUS.SUCCESS === res.code) {
      const { totalAmount = "0", total = 0 } = res.data;
      const pagination = {
        total,
        onChange: page => {
          const { businessType, params } = filter;
          const qyeryParams = Object.assign({}, params, initPage, {
            pageIndex: page
          });
          this.querySelfSaleRevenueSummaryByBusinessType({
            businessType,
            params: qyeryParams
          });
        }
      };
      this.setState({
        total,
        totalAmount,
        pagination,
        dataSource: res.data.data || [],
        queryParams: filter
      });
    } else {
      message.error(res.message);
    }
  };

  getTableProps = () => {
    const { dataSource, pagination } = this.state;
    const columns = [
      {
        title: "代理商类型",
        dataIndex: "distType",
        key: "distType"
      },
      {
        title: "所在地区",
        dataIndex: "area",
        key: "area",
        render: text => (text ? getAreaInfo(text) : "---")
      },
      {
        title: "代理商",
        dataIndex: "nickName",
        key: "nickName"
      },
      {
        title: "图书馆名称",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "图书馆ID",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "付费类型",
        dataIndex: "enablePaid",
        key: "enablePaid"
      },
      {
        title: "图书馆状态",
        dataIndex: "publishStatus",
        key: "publishStatus",
        render: text => PublishStatusText[text]
      },
      {
        title: "创建人",
        dataIndex: "createUserName",
        key: "createUserName"
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTime"
      },
      {
        title: "销售金额(元)",
        dataIndex: "totalAmount",
        key: "totalAmount"
      },
      {
        title: "销售收益(元)",
        dataIndex: "clearingAmount",
        key: "clearingAmount"
      },
      {
        title: "操作",
        key: "action",
        render: record => (
          <a
            onClick={() => {
              const { queryParams } = this.state;
              const params = {
                ...queryParams,
                type: IncomeDetailType.MINE,
                title: record.title
              };
              const locationUrl = `${BASE_PATH}/income/sell/${record.id}`;
              this.props.history.push(locationUrl, params);
            }}
          >
            查看详情
          </a>
        )
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
    const { filter } = this.props;
    const { total } = this.state;
    return (
      <div>
        <Query filter={filter} onSubmit={this.handleSubmit} />
        <section style={{ padding: "20px 0 5px" }}>
          <p>
            共找到<span style={{ color: "red" }}>{total}</span>笔数据
          </p>
        </section>
        <Table {...this.getTableProps()} />
      </div>
    );
  }
}

export default withRouter(Mine);
