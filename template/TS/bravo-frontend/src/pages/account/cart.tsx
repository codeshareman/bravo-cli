import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { message } from "antd";
import MainLayout from "@/layout";
import EditOrderList from "@/components/EditOrderList";
import PurchaseInfoLayer from "@/components/PurchaseInfoLayer";
import { HTTP_STATUS } from "@/shared/common/constants";
import { ICart } from "@/models/cart";
import Api from "@/api";

import "./css/cart.scss";

type P = {
  orderStore: any;
  cartStore?: ICart;
};
type S = {};

// 购物车
@inject("orderStore", "cartStore")
@observer
class ShoppingCart extends Component<P, S> {
  readonly state: S = {};

  UNSAFE_componentWillMount() {
    this.getCartInfo();
  }

  getCartInfo = async () => {
    const res = await Api.cart.all();
    if (HTTP_STATUS.SUCCESSS === res.code) {
      const { cartStore } = this.props;
      cartStore.setProductList(res.data || []);
    } else {
      message.error(res.message);
    }
  };

  onCheckAll = e => {
    this.props.cartStore.onCheckAll(e.target.checked);
  };

  onChange = productList => {
    this.props.cartStore.setProductList(productList);
  };

  render() {
    const { productList, checkedStatus } = this.props.cartStore;

    return (
      <MainLayout>
        <div className="shop-cart">
          <EditOrderList
            checkable
            checkedStatus={checkedStatus}
            productList={productList}
            onChange={this.onChange}
            onCheckAll={this.onCheckAll}
          />
          <PurchaseInfoLayer />
        </div>
      </MainLayout>
    );
  }
}

export default ShoppingCart;
