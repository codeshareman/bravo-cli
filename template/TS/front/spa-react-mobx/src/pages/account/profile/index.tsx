import * as React from "react";
import {
  Button,
  Statistic,
  Divider,
  Table,
  message,
  Icon,
  Tooltip
} from "antd";
import ContentView from "@/layout/ContentView";
import Query from "./query";
import { AccountDetail } from "@/api/service/AccountService";
import { defaultAccountDetail } from "../index";
import { HTTP_STATUS } from "@/shared/common/constants";
import { getOpenRechargeURL, getOpenWithdrawURL } from "@/shared/common/utils";
import MainLayout from "@/layout";
import { PaginationProps } from "antd/lib/pagination";
import { TradeTypeText } from "@/shared/common/constants";
import { TradeType } from "@/api/service/AccountService";
import moment from "moment";
import Api from "@/api";

import "../css/profile.scss";

type P = {};
type S = {
  entity: AccountDetail;
  dataSource: any[];
  queryParams: object;
  pagination: PaginationProps;
};

const Init_Page = {
  pageIndex: 1,
  pageSize: 10
};

class AccountProfile extends React.Component<P, S> {
  state = {
    entity: defaultAccountDetail,
    dataSource: [],
    queryParams: {},
    pagination: {}
  };
  componentDidMount() {
    this.initData();
  }
  initData = () => {
    this.getList({ ...Init_Page });
    this.getAccountDetail();
  };

  getAccountDetail = async () => {
    const res = await Api.account.detail();
    if (HTTP_STATUS.SUCCESSS === res.code) {
      this.setState({
        entity: res.data
      });
    } else {
      message.error(res.message);
    }
  };

  getList = async params => {
    const res = await Api.account.queryDealStatement(params);
    if (HTTP_STATUS.SUCCESSS === res.code) {
      this.setState({
        dataSource: res.data.data || []
      });
    } else {
      message.error(res.message);
    }
  };

  //充值
  handleRecharge = () => {
    window.open(getOpenRechargeURL());
  };

  handleWithdraw = () => {
    window.open(getOpenWithdrawURL());
  };

  onSubmit = values => {
    this.getList(Object.assign({}, values, Init_Page));
  };

  getTableProps = () => {
    const { dataSource, pagination } = this.state;
    const columns = [
      {
        title: "交易流水号",
        dataIndex: "trxNo",
        key: "trxNo"
      },
      {
        title: "收入",
        dataIndex: "income",
        key: "income",
        render: text => (
          <span style={{ color: "#51A773" }}>{text ? text : "--"}</span>
        )
      },
      {
        title: "支出",
        dataIndex: "expense",
        key: "expense",
        render: text => (
          <span style={{ color: "#FE5461" }}>{text ? text : "--"}</span>
        )
      },
      {
        title: "账户总金额",
        dataIndex: "balance",
        key: "balance"
      },
      {
        title: "交易类型",
        dataIndex: "tradeType",
        key: "tradeType",
        render: text => TradeTypeText[text]
      },
      {
        title: "备注",
        dataIndex: "remark",
        key: "remark"
      },
      {
        title: "交易时间",
        dataIndex: "tradeTime",
        key: "tradeTime",
        render: time =>
          time ? moment(time).format("YYYY-MM-DD hh:mm:ss") : "--"
      }
    ];

    return {
      dataSource,
      columns,
      pagination
    };
  };

  render() {
    const { entity } = this.state;
    return (
      <MainLayout>
        <ContentView>
          <div className="profile">
            <div className="profile-overview">
              <h2 className="title">账户概况</h2>
              <div className="profile-overview-warp">
                <div className="overview-item">
                  <div className="overview-item-content">
                    <div className="sub-title">
                      <span>现金账户可用余额</span>
                      <Tooltip title="">
                        <Icon type="question-circle" />
                      </Tooltip>
                    </div>
                    <div className="sub-desc">
                      <Statistic
                        value={entity.availableAmount || 0}
                        prefix="¥"
                        precision={2}
                      />
                    </div>
                  </div>
                  <div className="overview-item-extra">
                    <Button type="primary" onClick={this.handleRecharge}>
                      充值
                    </Button>
                    <br />
                    <Button type="dashed" onClick={this.handleWithdraw}>
                      提现
                    </Button>
                  </div>
                </div>
                <Divider type="vertical" style={{ height: 40 }} />
                <div className="overview-item">
                  <div className="overview-item-content">
                    <div className="sub-title">
                      <span>冻结金额</span>
                      <Tooltip title="冻结金额：提现审核过程中，提现金额会被冻结，审核失败会退回至您的现金账户中。冻结时，提现金额不可转出，不可扣款。">
                        <Icon type="question-circle" />
                      </Tooltip>
                    </div>
                    <div className="sub-desc">
                      <Statistic
                        value={entity.freezeMoney || 0}
                        prefix="¥"
                        precision={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-list">
              <h2 className="title">收支明细</h2>
              <Query onSubmit={this.onSubmit} />
              <Table {...this.getTableProps()} />
            </div>
          </div>
        </ContentView>
      </MainLayout>
    );
  }
}

export default AccountProfile;
