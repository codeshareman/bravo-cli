import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { message, Modal, Button, Spin } from "antd";
import { inject, observer } from "mobx-react";
import MainLayout from "@/layout";
import Review from "./review";
import { ReviewStatus, IReviewItem } from "./review/ReviewItem";
import { HTTP_STATUS, ApplyStatus } from "@/shared/common/constants";
import { AccountStatus } from "@/api/service/AccountService";
import { IUserStore } from "@/models/user";
import { IAuthStore } from "@/models/auth";

import Api from "@/api";

import "./index.scss";

type P = RouteComponentProps & {
  userStore?: IUserStore;
  authStore?: IAuthStore;
};
type S = {
  visible: boolean;
  tips: string;
};

@inject("userStore", "authStore")
@observer
class main extends Component<P, S> {
  state = {
    visible: false,
    tips: ""
  };

  UNSAFE_componentWillMount() {
    //this.getPerms();
    this.getAccountStatus();
  }

  getPerms = () => {
    Api.account.perms().then(res => {
      if (HTTP_STATUS.SUCCESSS == res.code) {
        this.props.authStore.setPerms(res.data || []);
      } else {
        message.destroy();
      }
    });
  };

  //获取商户状态
  getAccountStatus = async () => {
    const res = await Api.account.status();

    // const res = {
    //   code: 0,
    //   message: "ok",
    //   data: {
    //     accountStatus: AccountStatus.NON_DEVELOPER,
    //     extra: {
    //       // 公司名称
    //       companyName: "喜马拉雅科技有限公司",
    //       // 审批拒绝原因
    //       approvalRejectReason: "信誉有问题"
    //     }
    //   }
    // };

    if (HTTP_STATUS.SUCCESSS === res.code) {
      const accountInfo = res.data;
      this.props.userStore.setAccountInfo(accountInfo);

      //账户确认
      const companyName =
        accountInfo && accountInfo.extra ? accountInfo.extra.companyName : "";
      //已注册为开发者，未注册成为服务商的需先确认
      if (AccountStatus.NON_CSP === accountInfo.accountStatus && companyName) {
        this.setState({
          visible: true,
          tips: `当前登录账号已绑定公司【${companyName}】，是否确认使用该公司信息申请成为服务商？`
        });
      }
    } else {
      message.error(res.message);
    }
  };

  toggleVisible = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible
    });
  };

  accountConfirmOk = () => {
    this.props.history.push({
      pathname: "/apply",
      state: {
        applyStatus: ApplyStatus.NON_CSP
      }
    });
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

  renderContent = () => {
    const { history, userStore } = this.props;
    const { accountInfo } = userStore;

    if (!accountInfo) {
      return null;
    } else if (AccountStatus.DISABLE === accountInfo.accountStatus) {
      // 停用
      const item: IReviewItem = {
        type: ReviewStatus.ACCOUNT_DISABLED,
        title: "您的账号已被停用",
        desc: "停用原因：涉嫌违规，账户封停！"
      };
      return <Review type={ReviewStatus.ACCOUNT_DISABLED} item={item} />;
    } else if (AccountStatus.NORMAL === accountInfo.accountStatus) {
      //启用
      this.getPerms();
      setTimeout(() => {
        history.replace("/dashboard");
      }, 500);
      return <Spin spinning></Spin>;
    } else if (AccountStatus.WAITING_APPROVAL === accountInfo.accountStatus) {
      //审核中
      const item: IReviewItem = {
        type: ReviewStatus.AUDIT_WAITING,
        title: "审核中",
        desc: "审核结果将在1-3个工作日发至您的邮箱"
      };
      return <Review type={ReviewStatus.AUDIT_WAITING} item={item} />;
    } else if (AccountStatus.APPROVAL_REJECT === accountInfo.accountStatus) {
      //审核失败

      const reason =
        accountInfo.extra && accountInfo.extra.approvalRejectReason
          ? accountInfo.extra.approvalRejectReason
          : "----";

      const item: IReviewItem = {
        type: ReviewStatus.AUDIT_REJECT,
        title: "审核失败",
        desc: "驳回原因：" + reason
      };
      return <Review type={ReviewStatus.AUDIT_REJECT} item={item} />;
    } else if (AccountStatus.NON_DEVELOPER === accountInfo.accountStatus) {
      //未注册开发者账号
      //return <Welcome />;

      this.props.history.push({
        pathname: "/apply",
        state: {
          applyStatus: ApplyStatus.NON_DEVELOPER
        }
      });

      return null;
    } else if (AccountStatus.NON_CSP === accountInfo.accountStatus) {
      //未入驻城市服务商, 跳转到商户申请页
      //return <Welcome />;

      return null;
    }
    //UNKNOWN 未知状态
    const item: IReviewItem = {
      type: ReviewStatus.UNKNOWN,
      title: "未知状态",
      desc: "当前账户状态异常!"
    };
    return <Review type={ReviewStatus.UNKNOWN} item={item} />;
  };

  render() {
    const { visible, tips } = this.state;
    return (
      <MainLayout hideMenu={true}>
        {this.renderContent()}
        <Modal
          maskClosable={false}
          closable={false}
          centered={true}
          width={400}
          visible={visible}
          title="确认账号"
          footer={null}
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
      </MainLayout>
    );
  }
}

export default withRouter(main);
