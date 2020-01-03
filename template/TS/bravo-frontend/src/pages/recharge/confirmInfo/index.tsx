import * as React from "react";
import { Button, Tooltip, Icon } from "antd";
import API from "@/api";
import { CheckRes } from "@/api/service/RechargeService";
import { getOpenRechargeURL } from "@/shared/common/utils";

import "./index.scss";

type P = {
  toRecharge(bool: Boolean): void;
  data: CheckRes;
};
type S = {};

class ConfirmInfo extends React.Component<P, S> {
  state = {};
  componentDidMount() {}
  EditInfo = () => {
    this.props.toRecharge(false);
  };
  recharge = () => {
    const { batchRechargeParam } = this.props.data || {};
    API.recharge.confirmRechage(batchRechargeParam.taskId);
  };
  render() {
    const {
      enough,
      availableAmount,
      realityTotalAmount,
      discount,
      totalAmount,
      batchRechargeParam
    } = this.props.data || {};
    const { clientOsType, itemType, mobileList = [], vipType, xiDianNum } =
      batchRechargeParam || {};
    return (
      <div className="confirm-info-page">
        <div className="charge-title">请确认充值信息</div>
        <div className="charge-content">
          <div className="charge-label">充值内容：</div>
          <div className="charge-detail">hah</div>
        </div>
        <div className="charge-content">
          <div className="charge-label">
            充值账户(<span>{mobileList.length}</span>个)：
            <Tooltip
              placement="top"
              title="如果充值账号还未在喜马注册过，那么会自动创建账户后进行权益的充值"
            >
              <Icon type="question-circle" style={{ color: "#DCE0E0" }} />
            </Tooltip>
          </div>
          <div className="charge-detail">
            {mobileList.map(phone => (
              <span>{phone}</span>
            ))}
          </div>
        </div>
        <div className="charge-content">
          <div className="charge-label">
            充值折扣：
            <Tooltip
              placement="top"
              title="充值折扣取的是该分销商在分销中心分销该充值内容的折扣。例：充值权益总价为100元，充值折扣为60%，那么会在您的扣款账户内的扣款金额为100*60%=60元"
            >
              <Icon type="question-circle" style={{ color: "#DCE0E0" }} />
            </Tooltip>
          </div>
          <div className="charge-detail" style={{ fontWeight: 600 }}>
            {discount}%
          </div>
        </div>
        <div className="charge-content">
          <div className="charge-label">
            总计金额：
            <Tooltip
              placement="top"
              title={
                <div>
                  <p>总计金额=充值内容单价*充值账户个数*充值折扣</p>
                  <p>
                    显示的总计金额是按照全部充值成功计算出来的金额，如果有部分充值失败的情况，会按照实际充值成功的金额扣款。
                  </p>
                  <p>
                    如果出现账户资金不足的情况，导致无法充值，请先进行账户充值，充值后将现金账户的资金转入扣款账户，即可继续进行权益充值
                  </p>
                </div>
              }
            >
              <Icon type="question-circle" style={{ color: "#DCE0E0" }} />
            </Tooltip>
            <p
              style={{
                fontSize: 12,
                color: "#7F8FA4",
                fontWeight: 300,
                marginTop: 8
              }}
            >
              资金从分销扣款账户扣除
            </p>
          </div>
          <div className="charge-detail">
            <span style={{ fontWeight: 600 }}>¥{realityTotalAmount}</span>
            {!enough && (
              <a
                href={getOpenRechargeURL()}
                style={{ color: "#215FFF", marginLeft: 20 }}
              >
                账户资金不足，请充值
                <Icon type="right" />
              </a>
            )}
          </div>
        </div>

        <div className="btns">
          <Button
            type="primary"
            style={{ marginRight: 16 }}
            onClick={this.recharge}
          >
            我已确认
          </Button>
          <Button onClick={this.EditInfo}>取消</Button>
        </div>
      </div>
    );
  }
}

export default ConfirmInfo;
