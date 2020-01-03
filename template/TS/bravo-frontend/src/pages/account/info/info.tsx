import * as React from "react";
import { Typography, message } from "antd";
import ContentView from "@/layout/ContentView";
import { AccountDetail } from "@/api/service/AccountService";
import { defaultAccountDetail } from "../index"
import { getDictInfoByCode } from "@/components/CustComponents/CitySelector/utils";
import { HTTP_STATUS, AccountRoleText } from "@/shared/common/constants";
import MainLayout from "@/layout";
import Api from "@/api";

import "../css/info.scss";

// 账户信息

type P = {};
type S = {
  entity: AccountDetail;
  agentDistrict: string;
};

const { Title, Paragraph, Text } = Typography;

class AccountInfo extends React.Component<P, S> {
  state = {
    entity: defaultAccountDetail,
    agentDistrict: ""
  };

  componentDidMount() {
    this.getAccountDetail();
  }

  getAccountDetail = async () => {
    const res = await Api.account.detail();
    console.log({ res });
    if (HTTP_STATUS.SUCCESSS === res.code) {
      this.setState({
        entity: res.data || null
      });
      const agentDistrict = res.data.agentDistrict || null;
      if (agentDistrict) {
        const info = getDictInfoByCode(agentDistrict);
        if (info) {
          this.setState({
            agentDistrict: info.name || ""
          });
        }
      }
    } else {
      message.error(res.message);
    }
  };

  render() {
    const { entity, agentDistrict } = this.state;
    return (
      <MainLayout>
      <ContentView>
        <div className="account-info">
          <h2 className="title">我的信息</h2>
          <div className="account-info-warp">
            <h4 className="account-info-title">公司信息</h4>
            <Paragraph>
              <Text className="account-info-sub-title">喜马拉雅账号</Text>
              <Text>{entity.nickName}</Text>
            </Paragraph>
            <Paragraph>
              <Text className="account-info-sub-title">喜马拉雅ID</Text>
              <Text>{entity.uid}</Text>
            </Paragraph>
            <Paragraph>
              <Text className="account-info-sub-title">公司名称</Text>
              <Text>{entity.companyName}</Text>
            </Paragraph>
            <Paragraph>
              <Text className="account-info-sub-title">公司官网</Text>
              <Text>{entity.companyWebsite}</Text>
            </Paragraph>
            <Paragraph>
              <Text className="account-info-sub-title">公司介绍</Text>
              <Text>{entity.companyDesc}</Text>
            </Paragraph>
            <Paragraph>
              <Text className="account-info-sub-title">公司地址</Text>
              <Text>{entity.companyAddress}</Text>
            </Paragraph>
            <Paragraph>
              <Text className="account-info-sub-title">角色</Text>
              <Text>{ entity.role ? AccountRoleText[entity.role] : "---"}</Text>
            </Paragraph>
          </div>
          <div className="account-info-warp">
            <h4 className="account-info-title">入驻业务</h4>
            <Paragraph>
              <Text className="account-info-sub-title">代理地区</Text>
              <Text>{agentDistrict}</Text>
            </Paragraph>
          </div>
          <div className="account-info-warp">
            <h4 className="account-info-title">联系人信息</h4>
            <Paragraph>
              <Text className="account-info-sub-title">姓名</Text>
              <Text>{entity.contactName}</Text>
            </Paragraph>
            <Paragraph>
              <Text className="account-info-sub-title">手机号</Text>
              <Text>{entity.phone}</Text>
            </Paragraph>
            <Paragraph>
              <Text className="account-info-sub-title">邮箱</Text>
              <Text>{entity.email}</Text>
            </Paragraph>
          </div>
        </div>
      </ContentView>
      </MainLayout>
    );
  }
}

export default AccountInfo;
