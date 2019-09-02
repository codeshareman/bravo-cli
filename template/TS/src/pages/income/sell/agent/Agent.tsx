import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Query from "./Query";
import SERVICE from "@/api";
import { Table, message, Button } from "antd";
import { FilterParams } from "@/types/agent";
import { PaginationProps } from "antd/lib/pagination";
import { getAreaInfo } from "@/utils/Helper";
import {
  AJAX_STATUS,
  BASE_PATH,
  IncomeDetailType,
  PublishStatusText
} from "@/utils/constant";

type P = RouteComponentProps & {
  filter: FilterParams;
};
type S = {
  total: number;
  dataSource: any[];
  pagination: PaginationProps;
  queryParams: {};
};

const initPage = {
  pageIndex: 1,
  pageSize: 10
};
class Agent extends Component<P, S> {
  state = {
    total: 0,
    dataSource: [],
    pagination: {},
    queryParams: {}
  };

  componentDidMount() {
    // this.initialSearch();
  }

  componentWillReceiveProps(nextProps) {
    const preFilter = this.props.filter;
    const nextFilter = nextProps.filter;

    //如果父级条件有变化则重制表单数据
    if (
      preFilter.businessType !== nextFilter.businessType ||
      preFilter.params.month !== nextFilter.params.month ||
      preFilter.params.year !== nextFilter.params.year
    ) {
      //this.initialSearch();
      this.resetData();
    }
  }

  resetData = () => {
    this.setState({
      dataSource: [],
      total: 0,
      pagination: {
        hideOnSinglePage: true
      }
    });
  };

  initialSearch = () => {
    const { filter } = this.props;
    const { businessType, params } = filter;
    const qyeryParams = Object.assign({}, params, initPage);
    this.queryChildSaleRevenueSummaryByBusinessType({
      businessType,
      params: qyeryParams
    });
  };

  handleSubmit = value => {
    const { businessType, params } = this.props.filter;
    const distArr = value.distUid;
    const distUid = distArr ? distArr[distArr.length - 1] : -1;
    const searchParams = {
      businessType,
      params: {
        ...params,
        queryString: value.queryString || "",
        distUid
      }
    };
    this.queryChildSaleRevenueSummaryByBusinessType(searchParams);
  };

  // 根据业务id统计子级分销商带来的收益数据，如图书馆业务则根据图书馆ID统计
  queryChildSaleRevenueSummaryByBusinessType = async (filter: FilterParams) => {
    const res = await SERVICE.revenue.queryChildSaleRevenueSummaryByBusinessType(
      filter.businessType,
      filter.params
    );
    try {
      if (res.code === AJAX_STATUS.SUCCESS) {
        const { total, data, pageIndex } = res.data;
        const pagination = {
          total,
          current: pageIndex,
          onChange: (page: number) => {
            const { businessType, params } = filter;
            const qyeryParams = Object.assign({}, params, initPage, {
              pageIndex: page
            });
            this.queryChildSaleRevenueSummaryByBusinessType({
              businessType,
              params: qyeryParams
            });
          }
        };
        this.setState({
          dataSource: data,
          total,
          pagination,
          queryParams: filter
        });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.log(err, message);
    }
  };

  getTableProps = () => {
    const { pagination, dataSource } = this.state;
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
                type: IncomeDetailType.AGENT,
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
      pagination,
      dataSource,
      columns
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

export default withRouter(Agent);
