import React, { Component } from "react";
import { Card, Typography, Divider, message, Statistic } from "antd";
import { CustBreadcrumb } from "@/components/CustComponents";
import MainLayout from "@/layout";
import EditOrderList from "@/components/EditOrderList";
import { PurchaseProductGroupDetail } from "@/api/service/CartService";
import { PurchaseOrderDetail } from "@/api/service/OrderService";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { HTTP_STATUS, OrderStateText } from "@/shared/common/constants";

import Api from "@/api";

import "./index.scss";

type P = RouteComponentProps<{
  id: string;
}> & {};
type S = {
  entity: PurchaseOrderDetail;
  productList: PurchaseProductGroupDetail[];
};

const { Paragraph, Text, Title } = Typography;

class Details extends Component<P, S> {
  state: S = {
    entity: null,
    productList: []
  };

  componentDidMount() {
    this.getDetails();
  }

  getDetails = async () => {
    const { id } = this.props.match.params;
    if (!id) {
      return false;
    }
    const res = await Api.order.detail(id);
    if (HTTP_STATUS.SUCCESSS === res.code) {
      const entity = res.data || null;
      const productList = res.data.purchaseList.purchaseList || [];
      this.setState({
        productList,
        entity
      });
    } else {
      message.error(res.message);
    }
  };

  render() {
    const { productList, entity } = this.state;

    let address = "--";
    if (entity) {
      address =
        entity.orderContactProvince +
        entity.orderContactCity +
        entity.orderContactArea +
        entity.orderContactAddressLine;
    }

    return (
      <MainLayout>
        <div className="order-details">
          <CustBreadcrumb />
          <div className="order-info">
            <div className="order-info-warp">
              <h3>订单信息</h3>
              <Paragraph>
                <Title level={4}>订单编号：</Title>
                <Text>{entity && entity.orderNo ? entity.orderNo : "--"}</Text>
              </Paragraph>
              <Paragraph>
                <Title level={4}>订单生成时间：</Title>
                <Text>
                  {entity && entity.createTime ? entity.createTime : "--"}
                </Text>
              </Paragraph>
              <Paragraph>
                <Title level={4}>订单金额：</Title>
                <Text>
                  {entity &&
                  entity.purchaseList &&
                  entity.purchaseList.totalAmount ? (
                    <Statistic
                      valueStyle={{ fontSize: 12 }}
                      prefix="¥"
                      value={entity.purchaseList.totalAmount}
                    />
                  ) : (
                    "--"
                  )}
                </Text>
              </Paragraph>
              <Paragraph>
                <Title level={4}>订单状态：</Title>
                <Text>
                  {entity && entity.state ? OrderStateText[entity.state] : "--"}
                </Text>
              </Paragraph>
              <Paragraph>
                <Title level={4}>订单完成时间：</Title>
                <Text>
                  {entity && entity.completedTime ? entity.completedTime : "--"}
                </Text>
              </Paragraph>
            </div>
            <Divider type="vertical" />
            <div className="order-info-warp">
              <h3>收货信息</h3>
              <Paragraph>
                <Title level={4}>收货人：</Title>
                <Text>
                  {entity && entity.orderContactName
                    ? entity.orderContactName
                    : "--"}
                </Text>
              </Paragraph>
              <Paragraph>
                <Title level={4}>收货地址：</Title>
                <Text>{address}</Text>
              </Paragraph>
              <Paragraph>
                <Title level={4}>手机号码：</Title>
                <Text>
                  {entity && entity.orderContactPhone
                    ? entity.orderContactPhone
                    : "--"}
                </Text>
              </Paragraph>
              <Paragraph>
                <Title level={4}>备注：</Title>
                <Text>{entity && entity.comment ? entity.comment : "--"}</Text>
              </Paragraph>
            </div>
          </div>
          <EditOrderList productList={productList} />
        </div>
      </MainLayout>
    );
  }
}

export default withRouter(Details);
