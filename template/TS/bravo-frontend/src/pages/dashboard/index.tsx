import React from "react";
import { Statistic, Button, message, Icon, Tooltip, Divider } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import MainLayout from "@/layout";
import { AccountDetail } from "@/api/service/AccountService";
import { getOpenRechargeURL, getOpenWithdrawURL } from "@/shared/common/utils";
import { HTTP_STATUS } from "@/shared/common/constants";
import { OrderState } from "@/api/service/OrderService";
import Api from "@/api";

import "./index.scss";

type P = RouteComponentProps & {};
type S = {
  accountDetail: AccountDetail;
};

// 订单中心
class Home extends React.Component<P, S> {
  state = {
    accountDetail: null
  };

  componentDidMount() {
    this.getAccountDetail();
  }

  getAccountDetail = async () => {
    const res = await Api.account.detail();
    if (HTTP_STATUS.SUCCESSS === res.code) {
      this.setState({
        accountDetail: res.data
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

  goOrderPage = (state: OrderState) => {
    console.log({ state });
    this.props.history.push({
      pathname: "/order",
      state: {
        orderState: state
      }
    });
  };

  render() {
    const { accountDetail } = this.state;

    return (
      <MainLayout>
        <div className="dashboard-warp">
          <div className="warp-left">
            <h3 className="title">
              <i className="icon-account"></i>
              账户中心
            </h3>

            <div className="warp-left-account">
              <div className="sub-title">
                <span>现金账户可用余额</span>
                <Tooltip title="">
                  <Icon type="question-circle" />
                </Tooltip>
              </div>
              <div className="sub-desc">
                <Statistic
                  value={accountDetail ? accountDetail.availableAmount || 0 : 0}
                  prefix="¥"
                  precision={2}
                />
              </div>
              <div className="btn-options">
                <Button type="primary" onClick={this.handleRecharge}>
                  充值
                </Button>
                <Button className="withdraw" onClick={this.handleWithdraw}>
                  提现
                </Button>
              </div>
              <div className="sub-title">
                <span>冻结金额</span>
                <Tooltip title="冻结金额：提现审核过程中，提现金额会被冻结，审核失败会退回至您的现金账户中。冻结时，提现金额不可转出，不可扣款。">
                  <Icon type="question-circle" />
                </Tooltip>
              </div>
              <div className="sub-desc">
                <Statistic
                  value={accountDetail ? accountDetail.freezeMoney || 0 : 0}
                  prefix="¥"
                  precision={2}
                />
              </div>
            </div>
          </div>
          <div className="warp-right">
            <h3 className="title">
              <i className="icon-order"></i>
              订单中心
            </h3>
            <ul className="order-warp">
              <li>
                <div>
                  <i className="order-icon icon-order-deliver"></i>
                  <div className="sub-title">待发货订单</div>
                  <a
                    className="sub-link"
                    onClick={() => {
                      this.goOrderPage(OrderState.WAIT_DELIVER);
                    }}
                  >
                    查看详情
                  </a>
                </div>
              </li>
              <li>
                <div>
                  <i className="order-icon icon-order-receive"></i>
                  <div className="sub-title">待收货订单</div>
                  <a
                    className="sub-link"
                    onClick={() => {
                      this.goOrderPage(OrderState.WAIT_RECEIVE);
                    }}
                  >
                    查看详情
                  </a>
                </div>
              </li>
              <li>
                <div>
                  <i className="order-icon icon-order-complete"></i>
                  <div className="sub-title">已完成订单</div>
                  <a
                    className="sub-link"
                    onClick={() => {
                      this.goOrderPage(OrderState.COMPLETE);
                    }}
                  >
                    查看详情
                  </a>
                </div>
              </li>
            </ul>
            <h3 className="title">
              <i className="icon-virtual-product"></i>
              虚拟商品分销
              <a className="distribution-center-link sub-link">进入分销中心</a>
            </h3>
            <div className="distribution-warp">
              <div className="distribution-warp-content">
                <div className="distribution-title">
                  申请成为分销商，入驻分销中心即可享受以下权益：
                </div>
                <p>- 分销喜马海量付费精品内容，轻松获取分销权益</p>
                <p>- 实时查看分销订单信息，了解交易动态</p>
                <p>- 系统每月自动出账，线上自助对账结算省心省力</p>
                <p>- 多维度可视化看板，辅助决策优化运营方案</p>
                <a className="sub-link">了解更多分销内容</a>
              </div>
              <div className="distribution-warp-bg"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
}

export default withRouter(Home);

declare let window: Window & {
  open: any;
};
