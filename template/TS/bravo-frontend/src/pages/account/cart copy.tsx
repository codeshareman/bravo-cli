import React, { Component } from "react";
import EditOrderList from "@/components/EditOrderList";
import PurchaseInfoLayer from "@/components/PurchaseInfoLayer";
import { inject, observer } from "mobx-react";
import { HTTP_STATUS } from "@/shared/common/constants";
import Api from "@/api";

import "./css/cart.scss";
import { message } from "antd";

type P = {
  orderStore: any;
};
type S = {
  checkedAll: boolean;
  indeterminate: boolean;
};

// 购物车
@inject("orderStore")
@observer
class ShoppingCart extends Component<P, S> {
  readonly state: S = {
    checkedAll: false,
    indeterminate: false
  };

  componentDidMount() {
    console.log(this.props.orderStore);
    this.getCartInfo()
  }

  getCartInfo = async () => {
    const res = await Api.cart.all();
    if (HTTP_STATUS.SUCCESSS === res.code) {
      console.log({res})
    } else {
      message.error(res.message);
    }
  };

  handleSetDataSource = dataSource => {};

  render() {
    const { orderList } = this.props.orderStore;
    return (
      <div className="shop-cart">
        <EditOrderList dataSource={orderList} />
        <PurchaseInfoLayer />
      </div>
    );
  }
}

export default ShoppingCart;
