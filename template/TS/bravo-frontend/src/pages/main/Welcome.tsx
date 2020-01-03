import React, { Component } from "react";
import { Modal, Button, message } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { IUserStore } from "@/models/user";
import { AccountStatus } from "@/api/service/AccountService";
import Api from "@/api";
import { HTTP_STATUS, ApplyStatus } from "@/shared/common/constants";

type P = RouteComponentProps & {
  userStore?: IUserStore;
};

type S = {
  visible: boolean;
  tips: string;
  visibleApplyNotes: boolean;
};

@inject("userStore")
@observer
class Welcome extends Component<P, S> {
  state = {
    visibleApplyNotes: false,
    visible: false,
    tips: ""
  };

  accountConfirmOk = () => {
    this.props.history.push("/apply");
  };

  accountConfirmSwitch = () => {
    Api.auth.logout().then(r => {
      if (HTTP_STATUS.SUCCESSS === r.ret) {
        sessionStorage.clear();
        this.props.userStore.clear();
        this.props.history.replace("/");
      } else {
        message.error(r.msg);
      }
    });
  };

  toggleVisible = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible
    });
  };

  toggleApplyNotes = () => {
    const { visibleApplyNotes } = this.state;
    this.setState({
      visibleApplyNotes: !visibleApplyNotes
    });
  };

  apply = () => {
    const { accountInfo } = this.props.userStore;

    //未注册开发者账号 , 点击申请后直接进入申请页面
    if (AccountStatus.NON_DEVELOPER === accountInfo.accountStatus) {
      this.props.history.push({
        pathname: "/apply",
        state: {
          applyStatus: ApplyStatus.NON_DEVELOPER
        }
      });
    } else if (AccountStatus.NON_CSP === accountInfo.accountStatus) {
      //已成为开发者账号，未入驻城市服务商
      const companyName =
        accountInfo && accountInfo.extra ? accountInfo.extra.companyName : "";
      this.setState({
        visible: true,
        tips: `当前登录账号已绑定公司【${companyName}】，是否确认使用该公司信息申请成为服务商？`
      });
      // this.props.history.push({
      //   pathname: "/apply",
      //   state: {
      //     applyStatus: ApplyStatus.NON_CSP
      //   }
      // });
    } else {
      
    }
  };

  render() {
    const { visible, visibleApplyNotes, tips } = this.state;
    return (
      <>
        <div className="main-info">
          <h3>喜马商户平台，欢迎您！</h3>
          <p>————欢迎申请成为喜马拉雅商户</p>
          <img
            src="https://s1.xmcdn.com/yx/otp-fe/last/dist/static/cat.6c29646a.png"
            alt=""
          />
          <div className="main-info-btns">
            <Button type="dashed" onClick={this.toggleApplyNotes}>
              查看申请要求
            </Button>
            <Button type="primary" onClick={this.apply}>
              立即申请
            </Button>
          </div>
        </div>
        <Modal
          closable
          visible={visible}
          title="确认账号"
          footer={null}
          centered={true}
          width={400}
          onCancel={this.toggleVisible}
        >
          <div className="account-confirm-modal">
            <p>{tips}</p>
            <br />
            <div className="modal-btns">
              <Button type="primary" onClick={this.accountConfirmOk}>
                确认
              </Button>
              <Button type="dashed" onClick={this.accountConfirmSwitch}>
                切换账号
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          className="apply-notes"
          visible={visibleApplyNotes}
          closable
          footer={null}
          title="申请要求"
          onOk={this.apply}
          onCancel={this.toggleApplyNotes}
        >
          <ul>
            <li>• 企业、公司资质完善且有效、经营合法。</li>
            <li>• 企业、公司必须成为喜马用户即有喜马账号。</li>
            <li>• 通过喜马官网或喜马APP均可注册成为喜马用户（手机号注册）。</li>
          </ul>
          <Button type="dashed" onClick={this.toggleApplyNotes}>
            知道了
          </Button>
        </Modal>
      </>
    );
  }
}

export default withRouter(Welcome);
