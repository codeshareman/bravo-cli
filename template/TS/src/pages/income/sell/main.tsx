import React, { Component } from "react";
import { connect } from "react-redux";
import Query from "../components/Query";
import Board from "../components/board";
import { MainContent } from "@/layout";
import { Tabs, message, Skeleton } from "antd";
import Title from "../components/title";
import Agent from "./agent";
import Mine from "./mine";
import SERVICE from "@/api";
import { AJAX_STATUS } from "@/utils/constant";
import { FilterParams, TabKey } from "../../../types/agent";
import { TBoardItem } from "../components/board/BoardItem";
import { RevenueSummary } from "client/service/RevenueService";

const TabPane = Tabs.TabPane;

interface S {
  boardData: TBoardItem[];
  filterParams: FilterParams;
  currentTabKey: number;
}
interface P {}

const initPage = {
  pageIndex: 1,
  pageSize: 10
};
class Sell extends Component<P, S> {
  state = {
    boardData: null,
    currentTabKey: TabKey.AGENT,
    filterParams: null
  };

  querySearch = () => {
    const { filterParams } = this.state;
    this.getTotalSaleRevenueByBusinessType(filterParams);
  };

  // 根据业务类型统计销售订单数据总额
  getTotalSaleRevenueByBusinessType = async (filterParams: FilterParams) => {
    const res = await SERVICE.revenue.getTotalSaleRevenueByBusinessType(
      filterParams.businessType,
      filterParams.params
    );
    if (res.code === AJAX_STATUS.SUCCESS) {
      const revenueSummary: RevenueSummary = res.data;
      const list: TBoardItem[] = [
        {
          title: "销售收益(元)",
          content: revenueSummary.clearingAmount || 0
        },
        {
          title: "销售金额(元)",
          content: revenueSummary.totalAmount || 0
        },
        {
          title: "分成比例",
          content: revenueSummary.currentRatio || "0%"
        }
      ];

      this.setState({
        boardData: list
      });
    } else {
      message.error(res.message);
    }
  };

  handleSubmit = (value: any) => {
    const yearMonth = value
      ? {
          year: ~~value.yearMonth.format("YYYY"),
          month: ~~value.yearMonth.format("MM")
        }
      : null;

    const crtSearchParams = {
      businessType: value.businessType,
      params: yearMonth
    };

    //获取数据
    this.setState(
      {
        filterParams: crtSearchParams
      },
      () => {
        this.querySearch();
      }
    );
  };

  handleTabChange = key => {
    const tabIndex = ~~key;
    this.setState({
      currentTabKey: tabIndex
    });
  };

  render() {
    const { filterParams, boardData = [], currentTabKey } = this.state;
    return (
      <MainContent
        pageHeader={{
          title: "销售收益",
          subTitle: "按月份查询每个业务线的数据",
          hidePageHeader:true
        }}
      >
        <Title title="收益概况" />
        <Query onSubmit={this.handleSubmit} />
        <Board dataSource={boardData} />
        <Title title="订单收益明细" />
        {//确保总查询条件已加载完成
        filterParams ? (
          <Tabs
            defaultActiveKey={String(currentTabKey)}
            onChange={this.handleTabChange}
          >
            <TabPane tab="代理商销售情况" key={String(TabKey.AGENT)}>
              <Agent filter={filterParams} />
            </TabPane>
            <TabPane tab="我的销售情况" key={String(TabKey.MINE)}>
              <Mine filter={filterParams} />
            </TabPane>
          </Tabs>
        ) : <Skeleton loading/>}
      </MainContent>
    );
  }
}

export default Sell;
