import React, { FC, useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Typography, Button, Checkbox, message } from "antd";
import { CodeInput } from "@/components/CustComponents";
import { ConfirmParams } from "@/api/service/PurchaseService";
import MainLayout from "@/layout";
import Api from "@/api";

import "./index.scss";
import { HTTP_STATUS } from "@/shared/common/constants";

type P = RouteComponentProps & {};

const { Paragraph, Text, Title } = Typography;

const PaymentConfirm: FC<P> = props => {
  const [contextId, setContextId] = useState("");
  const [code, setCode] = useState("");
  const [entity, setEntity] = useState(null);
  const [agreement, setAgreement] = useState(false);

  useEffect(() => {
    const { state } = props.location;
    if (state && state.contextId) {
      const contextId = state.contextId;
      setContextId(contextId);
      console.log({ contextId });
      Api.purchase
        .getConfirmParams({ contextId: encodeURIComponent(contextId) })
        .then(r => {
          console.log({ r });
          setEntity(r.data);
        });
    }
  }, []);

  const handelChange = e => {
    setCode(e.target.value);
  };

  const onCancel = () => {
    props.history.goBack();
  };

  const onSubmit = () => {
    if (contextId && code) {
      const params = {
        contextId,
        verifyCode: code
      };
      console.log({ params });
      Api.purchase.confirm(params).then(r => {
        console.log(r);
        if (HTTP_STATUS.SUCCESSS === r.code) {
          message.success("订单确认成功");
          props.history.push("/order");
        } else {
          message.error(r.message);
        }
      });
    } else {
      message.error("请输入验证码");
    }
  };

  return (
    <MainLayout>
      <div className="payment-confirm">
        <div className="payment-confirm-title">请确认支付信息</div>
        <Paragraph>
          <Title level={4}>公司名称：</Title>
          <Text>{entity ? entity.companyName : ""}</Text>
        </Paragraph>
        <Paragraph>
          <Title level={4}>公司联系人：</Title>
          <Text>{entity ? entity.contactName : "--"}</Text>
        </Paragraph>
        <Paragraph>
          <Title level={4}>现金账户可用余额：</Title>
          <Text>{entity ? entity.balance : "--"}</Text>
        </Paragraph>
        <Paragraph>
          <Title level={4}>订单金额：</Title>
          <Text>{entity ? entity.totalAmount : "--"}</Text>
        </Paragraph>
        <Paragraph>
          <Title level={4}>应付货款：</Title>
          <Text>{entity ? entity.payAmount : "--"}</Text>
        </Paragraph>
        <Paragraph>
          <Title level={4}>联系人手机：</Title>
          <Text>{entity ? entity.phone : "--"}</Text>
        </Paragraph>
        <Paragraph>
          <Title level={4}>手机验证码：</Title>
          <Text>
            <CodeInput
              style={{
                width: 300
              }}
              dist={entity ? entity.phone : ""}
              onChange={handelChange}
            />
          </Text>
        </Paragraph>
        <Checkbox
          onChange={e => {
            setAgreement(e.target.checked);
          }}
        >
          我同意：下单后，从我的现金账户扣取应付货款金额！
        </Checkbox>
        <div className="payment-confirm-btns">
          <Button type="primary" disabled={!agreement} onClick={onSubmit}>
            我已确认
          </Button>
          <Button type="dashed" onClick={onCancel}>
            取消
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default withRouter(PaymentConfirm);
