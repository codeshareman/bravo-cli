import * as React from "react";
import { connect } from "react-redux";

import SERVICE from "@/api";
import DataCard from "../children/DataCard";
import { SET_BOARD_PARAMS } from "@/store/actionTypes/viewboard";
import { AJAX_STATUS, USER_INFO } from "@/utils/constant";
import { DashboardLibraryVo } from "client/service/DashboardService";
import FormItemDecorator from "@/components/FormItemDecorator";
import { Form, Cascader, Input, message } from "antd";
import { FormComponentProps } from "antd/lib/form";

import "../styles/card-layer.scss";
import { getCasaderData } from "@/utils/Helper";
import { DashboardAreaRequest } from "client/service/DashboardService2";
import { AgentMode } from "@/utils/enums";
import { REQUEST_STATUS, CardType } from "../children/DataCard/enums";
import moment from "moment";

interface P extends FormComponentProps {
  viewBoard: {
    queryParams: any;
  };
  setBoardParams: (data: Object) => {};
}
interface S {
  cardTodayData: DashboardLibraryVo;
  cardTotalData: DashboardLibraryVo;
  vipTodayData: {
    saleCount: number;
    saleAmount: number;
  };
  vipTotalData: {
    saleCount: number;
    saleAmount: number;
  };
}

class DataCardList extends React.Component<P, S> {
  state: S = {
    cardTodayData: null,
    cardTotalData: null,
    vipTodayData: null,
    vipTotalData: null
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.viewBoard.queryParams.productVal !==
      this.props.viewBoard.queryParams.productVal
    ) {
      this.getCardListData();
    }
  }

  // 获取卡片数据
  getCardListData = () => {
    const { getFieldsValue } = this.props.form;
    setTimeout(async () => {
      const queryData = getFieldsValue();
      const showVipCard = USER_INFO.roleType === "INNER";
      this.getLastDayLibrarySummaryInfo(queryData);
      this.getTotalLibrarySummaryInfo(queryData);
      showVipCard && this.getLastDayVipInfo();
      showVipCard && this.getTotalVipInfo();
    });
  };

  // 获取大盘前一天数据
  getLastDayLibrarySummaryInfo = async (params: DashboardAreaRequest) => {
    const res = await SERVICE.viewboard.getLastDayLibrarySummaryInfo(params);
    this.setState({
      cardTodayData: null
    });
    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        cardTodayData: res.data
      });
    } else {
      message.error("获取大盘前一天数据失败");
    }
  };

  // 获取大盘总计数据
  getTotalLibrarySummaryInfo = async (params: DashboardAreaRequest) => {
    const res = await SERVICE.viewboard.getTotalLibrarySummaryInfo(params);
    this.setState({
      cardTotalData: null
    });
    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        cardTotalData: res.data
      });
    } else {
      message.error("获取大盘总计数据失败");
    }
  };

  // 获取大盘前一天会员销售数据
  getLastDayVipInfo = async () => {
    const res = await SERVICE.viewboard.getLastDayVipInfo();
    this.setState({
      vipTodayData: null
    });
    if (res.code === AJAX_STATUS.SUCCESS) {
      const curCardData = {
        saleCount: res.data.saleCount,
        saleAmount: parseFloat(res.data.saleAmount)
      };
      this.setState({
        vipTodayData: curCardData
      });
    } else {
      message.error("获取会员销售数据失败");
    }
  };

  // 获取图书馆VIP销售总计
  getTotalVipInfo = async () => {
    const res = await SERVICE.viewboard.getTotalVipInfo();
    this.setState({
      vipTotalData: null
    });
    if (res.code === AJAX_STATUS.SUCCESS) {
      const curCardData = {
        saleCount: res.data.saleCount,
        saleAmount: parseFloat(res.data.saleAmount)
      };

      this.setState({
        vipTotalData: curCardData
      });
    } else {
      message.error("获取图书馆VIP销售总计失败");
    }
  };

  render() {
    const {
      cardTodayData,
      cardTotalData,
      vipTodayData,
      vipTotalData
    } = this.state;
    const areaList = getCasaderData();
    const currentTime = moment().format("LL");
    const showArea =
      USER_INFO.agentMode === AgentMode.postalGroup ||
      USER_INFO.roleType === "INNER";
    const showVipCard = USER_INFO.roleType === "INNER";

    return (
      <div className="card-wrapper">
        <h2>大盘数据</h2>
        <div className="query-area">
          <Form layout="inline">
            <span className="now">{currentTime}</span>
            {/* 运营可见 */}
            {showArea && (
              <FormItemDecorator
                form={this.props.form}
                label="区域/城市"
                filed={"area"}
              >
                <Cascader
                  style={{ width: 200 }}
                  placeholder="全国"
                  options={areaList}
                  onChange={this.getCardListData}
                  expandTrigger="hover"
                  changeOnSelect
                />
              </FormItemDecorator>
            )}
            <FormItemDecorator
              form={this.props.form}
              label="图书馆名称"
              filed={"queryString"}
            >
              <Input
                placeholder="请输入图书馆名称或ID"
                onChange={this.getCardListData}
              />
            </FormItemDecorator>
          </Form>
        </div>
        <div className="card-conten card-conten-top">
          <DataCard
            title={"图书馆当天日活"}
            count={
              cardTodayData ? cardTodayData.uniqueVisitor : REQUEST_STATUS.FALSE
            }
          />
          <DataCard
            title={"图书馆当天新增UV"}
            count={
              cardTodayData
                ? cardTodayData.newUniqueVisitor
                : REQUEST_STATUS.FALSE
            }
          />
          <DataCard
            title={"当天专辑销量"}
            count={
              cardTodayData
                ? cardTodayData.albumSaleCount
                : REQUEST_STATUS.FALSE
            }
          />
          <DataCard
            title={"当天专辑销售额"}
            type={CardType.AMOUNT}
            count={
              cardTodayData
                ? parseFloat(cardTodayData.albumSaleAmount)
                : REQUEST_STATUS.FALSE
            }
          />
          {showVipCard && (
            <DataCard
              title={"当天会员销量"}
              count={
                vipTodayData ? vipTodayData.saleCount : REQUEST_STATUS.FALSE
              }
            />
          )}
          {showVipCard && (
            <DataCard
              title={"当天会员销售额"}
              type={CardType.AMOUNT}
              count={
                vipTodayData ? vipTodayData.saleAmount : REQUEST_STATUS.FALSE
              }
            />
          )}
        </div>
        <div className="card-conten card-conten-bottom">
          <DataCard
            title={"累计访问数（PV)"}
            count={
              cardTotalData ? cardTotalData.pageView : REQUEST_STATUS.FALSE
            }
          />
          <DataCard
            title={"累计用户数（UV)"}
            count={
              cardTotalData ? cardTotalData.uniqueVisitor : REQUEST_STATUS.FALSE
            }
          />
          <DataCard
            title={"专辑累计销量"}
            count={
              cardTotalData
                ? cardTotalData.albumSaleCount
                : REQUEST_STATUS.FALSE
            }
          />
          <DataCard
            title={"专辑累计销售额"}
            type={CardType.AMOUNT}
            count={
              cardTotalData
                ? parseFloat(cardTotalData.albumSaleAmount)
                : REQUEST_STATUS.FALSE
            }
          />
          {showVipCard && (
            <DataCard
              title={"会员累计销量"}
              count={
                vipTotalData ? vipTotalData.saleCount : REQUEST_STATUS.FALSE
              }
            />
          )}
          {showVipCard && (
            <DataCard
              title={"会员累计销售额"}
              type={CardType.AMOUNT}
              count={
                vipTotalData ? vipTotalData.saleAmount : REQUEST_STATUS.FALSE
              }
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    viewBoard: state.viewBoard
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    setBoardParams: (data: Object) => {
      dispatch({
        type: SET_BOARD_PARAMS,
        payload: data
      });
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(DataCardList));
