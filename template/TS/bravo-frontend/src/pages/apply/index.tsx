import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Modal, message, Spin } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import MainLayout from "@/layout";
import ApplyForm from "./ApplyForm";
import Agreement from "./Agreement";
import { IUserStore } from "@/models/user";
import { HTTP_STATUS, ApplyStatus } from "@/shared/common/constants";
import { AccountApplyRequest } from "@/api/service/AccountService";
import Api from "@/api";

import "./index.scss";

type P = RouteComponentProps & {
  userStore?: IUserStore;
};
type S = {
  agreement: boolean;
  showAgreement: boolean;
  entity: AccountApplyRequest;
  isCreate: boolean; //添加模式
};

const DEV_ADD_REG = new RegExp(/[^\x00-\xff]+\/[^\x00-\xff]+\/[^\x00-\xff]+-/g); //开放平台地址正则
@inject("userStore")
@observer
class Apply extends Component<P, S> {
  state = {
    agreement: false,
    showAgreement: false,
    entity: null,
    isCreate: true
  };

  componentDidMount() {
    const { state } = this.props.location;
    if (!state) {
      return false;
    } else if (ApplyStatus.RE_APPLY === state.applyStatus) {
      this.setState({
        isCreate: false
      });
      this.getApplyInfo();
    } else if (ApplyStatus.NON_CSP === state.applyStatus) {
      this.setState({
        isCreate: false
      });
      this.getDeveloperInfo();
    }
  }

  toggleAgreement = () => {
    const { showAgreement } = this.state;
    this.setState({
      showAgreement: !showAgreement
    });
  };

  //获取开发者信息
  getDeveloperInfo = async () => {
    try {
      const res = await Api.account.developerInfo();
      if (HTTP_STATUS.SUCCESSS === res.code) {
        const { id, uid, registerInfo } = res.data;
        const {
          companyName,
          companyUrl,
          companyDesc,
          businessLicenseUrl,
          name,
          mobile,
          email
        } = registerInfo;
        let { companyAddr, address } = registerInfo;

        if (DEV_ADD_REG.test(companyAddr)) {
          companyAddr = companyAddr.split(DEV_ADD_REG)[1];
        }
        if (address) {
          address = address.replace(/\//g, ",");
        }

        const entity = {
          developerId: id,
          uid: Number(uid),
          companyName,
          companyHomePage: companyUrl,
          companyIntro: companyDesc,
          companyAddr,
          companyBusinessLicense: businessLicenseUrl,
          agencyArea: null,
          contactName: name,
          contactMobile: mobile,
          contactEmail: email,
          contactMobileVerifyCode: null,
          contactEmailVerifyCode: null,
          companyArea: address
        };

        this.setState({
          entity
        });
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  //获取上次提交的信息
  getApplyInfo = async () => {
    try {
      const res = await Api.account.applyInfo();
      if (HTTP_STATUS.SUCCESSS === res.code) {
        const {
          uid,
          companyName,
          companyHomePage,
          companyIntro,
          companyArea,
          companyAddr,
          companyBusinessLicense,
          agencyArea,
          contactName,
          contactMobile,
          contactEmail
        } = res.data;
        const entity = {
          uid,
          companyName,
          companyHomePage,
          companyIntro,
          companyArea,
          companyAddr,
          companyBusinessLicense,
          agencyArea,
          contactName,
          contactMobile,
          contactEmail,
          contactMobileVerifyCode: null,
          contactEmailVerifyCode: null
        };

        this.setState({
          entity
        });
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  onSubmit = async values => {
    if (values.companyArea) {
      values.companyArea = values.companyArea.join(",");
    }
    const res = await Api.account.apply(values);
    if (HTTP_STATUS.SUCCESSS === res.code) {
      message.success("提交成功");
      this.props.userStore.setAccountInfo(null)
      this.props.history.replace("/index");
    } else {
      message.error(res.message);
    }
  };

  onAgreementChange = checked => {
    this.setState({
      agreement: checked
    });
  };

  render() {
    const { showAgreement, entity, agreement, isCreate } = this.state;
    const { state } = this.props.location;

    //公司名不能编辑
    const companyNameDisabled =
      state && ApplyStatus.NON_CSP === state.applyStatus;

    return (
      <MainLayout hideMenu={true}>
        <div className="apply-from">
          <h3>欢迎加入城市服务商</h3>

          {entity || isCreate ? (
            <ApplyForm
              agreement={agreement}
              onGoBack={() => {
                this.props.history.replace("/");
              }}
              companyNameDisabled={companyNameDisabled}
              entity={entity}
              onAgreement={this.toggleAgreement}
              onAgreementChange={this.onAgreementChange}
              onSubmit={this.onSubmit}
            />
          ) : (
            <Spin spinning />
          )}

          <Modal
            maskClosable
            title="喜马拉雅开放平台开发者协议"
            width={800}
            closable
            visible={showAgreement}
            footer={null}
            //onOk
            onCancel={this.toggleAgreement}
          >
            <Agreement
              onOk={this.onAgreementChange}
              onCancel={this.toggleAgreement}
            />
          </Modal>
        </div>
      </MainLayout>
    );
  }
}

export default withRouter(Apply);
