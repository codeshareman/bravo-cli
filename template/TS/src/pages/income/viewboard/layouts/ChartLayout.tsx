import * as React from "react";
import { connect } from "react-redux";
import { Form, message } from "antd";

import SERVICE from "@/api";
import ChartQuery from "../children/ChartQuery";
import { Series } from "@/components/BizChartCompo";
import { SET_BOARD_PARAMS } from "@/store/actionTypes/viewboard";
import { AJAX_STATUS, USER_INFO } from "@/utils/constant";
import { DashboardVIPVo } from "client/service/DashboardService2";
import { ChartType } from "@/utils/enums";
import { DashboardLibraryVo } from "client/service/DashboardService";
import "../styles/chart-layer.scss";

interface P {
  title: string;
  viewBoard: {
    queryParams: any;
  };
  setBoardParams: (data: Object) => {};
}
interface S {
  retainedData: Array<DashboardLibraryVo>;
  memberConverData: Array<DashboardVIPVo>;
  visitData: Array<DashboardLibraryVo>;
}

class ChartLayout extends React.Component<P, S> {
  state: S = {
    memberConverData: [],
    retainedData: [],
    visitData: []
  };

  componentWillReceiveProps(nextProps: React.ComponentProps<any>) {
    if (
      nextProps.viewBoard.queryParams.productVal !==
      this.props.viewBoard.queryParams.productVal
    ) {
      this.initialRequest();
    }
  }

  initialRequest = () => {
    this.queryVIPConversionRate();
    this.queryVisitInfo();
    this.queryReatainedInfo();
  };

  // 查询会员转化率
  queryVIPConversionRate = async () => {
    const { viewBoard } = this.props;
    const params = viewBoard.queryParams;
    const vipParams = {
      statisticalType: params.dismension,
      start: params.rangeTime && params.rangeTime[0].format("YYYY.MM.DD"),
      end: params.rangeTime && params.rangeTime[1].format("YYYY.MM.DD")
    };

    const res = await SERVICE.viewboard.queryVIPConversionRate(
      vipParams.statisticalType,
      vipParams.start,
      vipParams.end
    );

    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        memberConverData: res.data.data
      });
    } else {
      message.error("获取会员转化率失败");
    }
  };

  queryVisitInfo = async () => {
    const { viewBoard } = this.props;
    const params = viewBoard.queryParams;
    const vipParams = {
      statisticalType: params.dismension,
      start: params.rangeTime && params.rangeTime[0].format("YYYY.MM.DD"),
      end: params.rangeTime && params.rangeTime[1].format("YYYY.MM.DD")
    };
    const visitParams = {
      ...vipParams,
      area: params.area,
      queryString: params.queryString
    };
    const res = await SERVICE.viewboard.queryLibraryViewInfo(visitParams);
    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        visitData: res.data.data
      });
    } else {
      message.error("获取访问数据失败");
    }
  };

  // 查询访问 & 次日留存
  queryReatainedInfo = async () => {
    const { viewBoard } = this.props;
    const params = viewBoard.queryParams;
    const vipParams = {
      statisticalType: params.dismension,
      start: params.rangeTime && params.rangeTime[0].format("YYYY.MM.DD"),
      end: params.rangeTime && params.rangeTime[1].format("YYYY.MM.DD")
    };
    const retainParams = {
      ...vipParams,
      area: params.area,
      queryString: params.queryString
    };
    const res = await SERVICE.viewboard.queryLibraryViewInfo(retainParams);
    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        retainedData: res.data.data
      });
    } else {
      message.error("获取次日留存数据失败");
    }
  };

  render() {
    const { memberConverData, visitData, retainedData } = this.state;
    const isOperater = USER_INFO.roleType === "INNER";
    return (
      <div className="chart-wrapper">
        {isOperater && (
          <div className="item">
            <ChartQuery
              isVipConverse={true}
              title="会员转化"
              onSubmit={this.queryVIPConversionRate}
            />
            <Series type={ChartType.VIP} dataSource={memberConverData} />
            <div className="attention">
              <p>
                会员转化：目前只支持统计到全国所有图书馆的转化。会员转化：指访问图书馆的人数，其中开通付费会员人数的比例
              </p>
              <p>
                对应的时间维度，取数据均值。如选择【周】，则显示该周日均会员转化比例，每一个节点显示的是每周一的数据；如选择【月】，则显示该月日均会员转化比例，每一个节点显示的是每月1号的数据。
              </p>
            </div>
          </div>
        )}
        <div className="item">
          <ChartQuery title="访问" onSubmit={this.queryVisitInfo} />
          <Series type={ChartType.VISIT} color="#f00" dataSource={visitData} />
          <div className="attention">
            <p>
              对应时间维度，取数据均值。如选择【周】，则显示该周日均PV、日均UV，每一个节点显示的是每周一的数据；如选择【月】，则显示该月日均PV、日均UV，每一个节点显示的是每月1号的数据。
              其中UV从20019年3月18日起，统计口径为Openid去重复。
            </p>
          </div>
        </div>
        <div className="item">
          <ChartQuery title="次日留存" onSubmit={this.queryReatainedInfo} />
          <Series
            type={ChartType.RETAIN}
            color="#22c1c1"
            dataSource={retainedData}
          />
          <div className="attention">
            <p> 20019年3月18日起，用户标识由原来的UUid改为Openid口径。</p>
            <p>
              次日留存：某天访问图书馆任意页面的用户（Openid）中，第二天再次访问图书馆的比例。
            </p>
          </div>
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
    setBoardParams: (data: number) => {
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
)(Form.create()(ChartLayout));
