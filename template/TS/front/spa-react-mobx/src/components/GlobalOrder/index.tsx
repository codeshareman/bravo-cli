import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { message } from "antd";
import { HTTP_STATUS } from "@/shared/common/constants";
import { ICart } from "@/models/cart";

import Api from "@/api";

import "./index.scss";

type P = RouteComponentProps & {
  cartStore?: ICart;
};

// 全局采购订单数
@inject("cartStore")
@observer
class GlobalOrder extends React.Component<P> {
  componentDidMount() {
    this.getTotal();
  }

  getTotal = async () => {
    const res = await Api.cart.total();
    if (HTTP_STATUS.SUCCESSS === res.code) {
      console.log({ res });
      this.props.cartStore.setTotal(res.data || 0);
    } else {
      message.error(res.message);
    }
  };

  handleClick = () => {
    this.props.history.push("/account/cart");
  };

  render() {
    const { cartStore } = this.props;
    return (
      <div className="global-order" onClick={this.handleClick}>
        <span className="icon-order"></span>
        采购单({cartStore.total || 0})
      </div>
    );
  }
}

export default withRouter(GlobalOrder);
