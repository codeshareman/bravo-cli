import React, { Component } from "react";
import { Input, Typography, Button, Divider, message } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { CustBreadcrumb } from "@/components/CustComponents";
import MainLayout from "@/layout";
import EditOrderList from "@/components/EditOrderList";
import Address from "./address";
import Api from "@/api";
import { HTTP_STATUS } from "@/shared/common/constants";
import { PurchaseList, PurchaseMethod } from "@/api/service/PurchaseService";
import { UserContactViewDto } from "@/api/service/ContactService";
import { ICart } from "@/models/cart";

import "./index.scss";

type P = RouteComponentProps & {
  cartStore?: ICart;
};
type S = {
  order: PurchaseList;
  defaultAddress: UserContactViewDto;
  purchaseMethod: PurchaseMethod; //下单方式
  comment: string;
};

const { TextArea } = Input;

const routes = [
  {
    path: "/account/cart",
    name: "采购单"
  },
  {
    name: "订单结算"
  }
];
@inject("cartStore")
@observer
class Settlement extends Component<P, S> {
  state = {
    order: null,
    defaultAddress: null,
    purchaseMethod: PurchaseMethod.DIRECT,
    comment: ""
  };

  UNSAFE_componentWillMount() {
    const { state } = this.props.location;
    console.log({ state });
    if (!state || !state.products) {
      return false;
    }
    this.getProductInfo(state.products);
    this.setState({
      purchaseMethod: state.purchaseMethod || PurchaseMethod.DIRECT
    });
  }

  getProductInfo = async products => {
    const res = await Api.purchase.purchaseList(products);
    console.log(res);
    if (HTTP_STATUS.SUCCESSS === res.code) {
      this.setState({
        order: res.data
      });
    } else {
      message.error(res.message);
    }
  };

  addressChange = item => {
    console.log(item, "addressChange");
    this.setState({
      defaultAddress: item
    });
  };

  textAreaChange = e => {
    const { value } = e.target;
    this.setState({
      comment: value
    });
  };

  submitOrder = async () => {
    const { defaultAddress, purchaseMethod, order, comment } = this.state;
    const { state } = this.props.location;
    if (!defaultAddress) {
      message.warn("请先添加收货地址");
      return false;
    }

    const params = {
      purchaseMethod,
      // 收货地址
      contactId: defaultAddress.usrContactId,
      // 备注
      comment,
      purchaseProductGroups: state.products
    };
    console.log({ params }, "--submitOrder--");

    const res = await Api.purchase.submit(params);
    console.log({ res });
    if (HTTP_STATUS.SUCCESSS === res.code) {
      message.success("订单提交成功");
      this.props.history.push({
        pathname: "/order/paymentConfirm",
        state: {
          contextId: res.data
        }
      });
    } else {
      message.error(res.message);
    }
  };

  render() {
    const { order } = this.state;

    const productList = order && order.purchaseList ? order.purchaseList : [];
    const balance = order && order.balance ? order.balance : 0;
    const productTypeCount =
      order && order.productTypeCount ? order.productTypeCount : 0;
    const totalAmount = order && order.totalAmount ? order.totalAmount : 0;
    const totalDiscountedAmount =
      order && order.totalDiscountedAmount ? order.totalDiscountedAmount : 0;
    const totalQuantity =
      order && order.totalQuantity ? order.totalQuantity : 0;

    return (
      <MainLayout>
        <div className="purchase-settlement">
          <CustBreadcrumb routes={routes} />
          <h4 className="purchase-settlement-title">选择收货地址</h4>
          <Address onChange={this.addressChange} />
          <Divider style={{ margin: "12px 0" }} />
          <h4 className="purchase-settlement-title">确认订单信息</h4>
          <EditOrderList checkable={false} productList={productList} />
          <div className="purchase-settlement-otherInfo">
            <div className="purchase-settlement-otherInfo-remark">
              <p>备注:</p>
              <TextArea rows={6} onChange={this.textAreaChange} />
            </div>
            <ul className="purchase-settlement-otherInfo-submit">
              <li>
                <span>可用余额：</span>
                <span>{balance}</span>
              </li>
              <li>
                <span>已选数量：</span>
                <span>{totalQuantity}</span>
              </li>
              <li>
                <span>已优惠：</span>
                <span>{totalDiscountedAmount}</span>
              </li>
              <li>
                <span>商品总价：</span>
                <span className="price">{totalAmount}</span>
              </li>
              <li>
                <Button type="primary" onClick={this.submitOrder}>
                  提交订单
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </MainLayout>
    );
  }
}

export default withRouter(Settlement);
