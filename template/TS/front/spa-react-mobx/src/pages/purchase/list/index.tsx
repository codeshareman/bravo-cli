import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Table, Statistic, message, Pagination } from "antd";
import MainLayout from "@/layout";
import ImgPreview from "@/components/ImgPreview";
import { PaginationProps } from "antd/lib/pagination";
import { Product } from "@/api/service/ProductService";
import Query from "./query";
import Api from "@/api";

import "./index.scss";
import { HTTP_STATUS } from "@/shared/common/constants";

type P = RouteComponentProps & {};
type S = {
  dataSource: Product[];
  pagination: PaginationProps;
  queryParams: any;
  total: number;
  loading: boolean;
};

const InitPage = {
  pageIndex: 1,
  pageSize: 10
};
class List extends Component<P, S> {
  state = {
    dataSource: [],
    pagination: {},
    total: 0,
    queryParams: {},
    loading: false
  };

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    this.queryList({ ...InitPage });
  };

  queryList = async params => {
    this.setState({
      loading: true
    });
    try {
      const res = await Api.product.queryProductPage(params);
      if (HTTP_STATUS.SUCCESSS === res.code) {
        const total = res.data.total;
        const current = res.data.current;
        this.setState({
          dataSource: res.data.data || [],
          total,
          loading: false,
          pagination: {
            total,
            current,
            pageSize: params.pageSize,
            onChange: (pageIndex, pageSize) => {
              this.queryList(
                Object.assign({}, params, { pageIndex, pageSize })
              );
            },
            onShowSizeChange: (pageIndex, pageSize) => {
              this.queryList(
                Object.assign({}, params, { pageIndex, pageSize })
              );
            }
          },
          queryParams: params
        });
      } else {
        message.error(res.message);
        this.setState({
          loading: false
        });
      }
    } catch (error) {
      this.setState({
        loading: false
      });
    }
  };

  handleSubmit = values => {
    this.queryList(Object.assign({}, InitPage, values));
  };

  handleDetails = record => {
    const { id } = record;
    this.props.history.push(`/purchase/details/${id}`);
  };

  getTableProps = () => {
    const { dataSource, pagination, total, loading } = this.state;
    const columns = [
      {
        title: "商品",
        dataIndex: "",
        key: "name",
        render: (record: Product) => {
          console.log({ record });
          return (
            <div className="procduct-name">
              <ImgPreview
                src={
                  record.coverPath
                    ? record.coverPath
                    : "http://upmallfiles.yonyouup.com/5a9d8883-18e1-42ab-810c-08f386adb1ae.png"
                }
                alt="封面图片"
              />
              <p>
                <span>{record.name}</span>
                <span>{record.id}</span>
              </p>
            </div>
          );
        }
      },
      // {
      //   title: "供货商",
      //   dataIndex: "supplier",
      //   key: "supplier"
      // },
      {
        title: "单价",
        dataIndex: "minPrice",
        key: "minPrice",
        render: text => (
          <Statistic prefix="¥" value={text} precision={2} suffix="起" />
        )
      },
      {
        title: "操作",
        key: "action",
        //align: alignCenter,
        render: record => (
          <a
            onClick={() => {
              this.handleDetails(record);
            }}
          >
            查看
          </a>
        )
      }
    ];
    return {
      loading,
      dataSource,
      columns,
      pagination: withPagination(pagination),
      rowKey: "id"
    };
  };

  render() {
    return (
      <MainLayout>
        <div className="purchase-list">
          <div className="purchase-list-title">
            <h2>全部商品</h2>
          </div>
          <Query onSubmit={this.handleSubmit} />
          <Table className="purchase-list-table" {...this.getTableProps()} />
        </div>
      </MainLayout>
    );
  }
}

export default withRouter(List);

export const withPagination = pagination => {
  return {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => {
      console.log({ total, range });
      return <span>共{total}条记录</span>;
    },
    ...pagination
  };
};
