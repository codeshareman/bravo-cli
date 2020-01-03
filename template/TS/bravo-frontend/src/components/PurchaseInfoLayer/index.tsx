import React from "react";
import { Checkbox, message, Statistic, Popconfirm } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { ICart } from "@/models/cart";
import { CheckedStatus, HTTP_STATUS } from "@/shared/common/constants";
import classnames from "classnames";
import { PurchaseMethod } from "@/api/service/PurchaseService";
import { AccountDetail } from "@/api/service/AccountService";
import Api from "@/api";

import "./index.scss";

type P = RouteComponentProps & {
  cartStore?: ICart;
  onCheckAll?(checked);
};
type S = {
  accountDetails: AccountDetail;
};

@inject("cartStore")
@observer
class PurchaseInfoLayer extends React.Component<P, S> {
  state = {
    accountDetails: null
  };

  componentDidMount() {
    this.getUserDetaisl();
  }

  getUserDetaisl = async () => {
    const res = await Api.account.detail();
    console.log({ res });
    if (HTTP_STATUS.SUCCESSS === res.code) {
      //this.props.userStore.setAccountInfo(res.data)
      this.setState({
        accountDetails: res.data || null
      });
    } else {
      message.error(res.message);
    }
  };

  handleSettlement = () => {
    const selectedProduct = [];
    const itemIds = [];
    const { productList } = this.props.cartStore;
    if (productList && productList.length) {
      //遍历出所有被选中商品
      productList.forEach(item => {
        const selectedItemPair = [];
        item.productItemDetails.forEach(i => {
          //被选中并且数量大于0
          if (i.checked && i.quantity > 0) {
            selectedItemPair.push({
              productItemId: i.productItemId,
              quantity: i.quantity
            });
            itemIds.push(i.productItemId);
          }
        });
        if (selectedItemPair && selectedItemPair.length) {
          selectedProduct.push({
            productId: item.productId,
            productItemPairs: selectedItemPair
          });
        }
      });
    } else {
      console.log("未选择商品");
    }

    if (selectedProduct && selectedProduct.length) {
      // this.savePurchaseList(selectedProduct);
      //this.removeCart(itemIds);
      this.props.history.push({
        pathname: "/purchase/settlement/order",
        state: {
          products: selectedProduct,
          purchaseMethod: PurchaseMethod.FROM_CART
        }
      });
    }
  };
  removeCart = async (ids: number[], cb) => {
    if (!ids || !ids.length) {
      return false;
    }
    const res = await Api.cart.remove(ids);
    if (HTTP_STATUS.SUCCESSS === res.code) {
      //删除成功
      message.success("删除成功");
      cb && cb();
    } else {
      message.error(res.message);
    }
  };

  handleDelete = () => {
    const itemIds = [];
    const { cartStore } = this.props;
    const { productList } = cartStore;
    const noSelectedProductList = []; //未被选中的商品列表， 用于更新采购单
    if (productList && productList.length) {
      //遍历出所有被选中商品
      productList.forEach(item => {
        const parentItem = {
          checked: false,
          checkedStatus: CheckedStatus.NON,
          productItemDetails: []
        };
        item.productItemDetails.forEach(i => {
          //被选中
          if (i.checked) {
            itemIds.push(i.productItemId);
          } else {
            parentItem.productItemDetails.push(i);
          }
        });

        if (
          parentItem &&
          parentItem.productItemDetails &&
          parentItem.productItemDetails.length
        ) {
          noSelectedProductList.push(parentItem);
        }
      });
      if (itemIds && itemIds.length) {
        this.removeCart(itemIds, () => {
          //更新采购商品总条数
          cartStore.asyncUpdateTotal();
          //更新采购单信息
          cartStore.setProductList(noSelectedProductList);
        });
      } else {
        message.warn("请先选择要删除的商品");
      }
    } else {
      console.log("未选择商品");
    }
  };

  savePurchaseList = async selectedProducts => {
    const res = await Api.purchase.purchaseList(selectedProducts);
    if (HTTP_STATUS.SUCCESSS === res.code) {
      message.success("操作成功");
      this.props.history.push({
        pathname: "/purchase/settlement/order",
        state: {
          selectedProducts
        }
      });
    } else {
      message.error(res.message);
    }
  };

  render() {
    const {
      onCheckAll,
      totalSelectedCount,
      totalSelectedAmount,
      totalSelectedDiscountedAmount,
      totalSelectedCategory,
      checkedStatus
    } = this.props.cartStore;
    const { accountDetails } = this.state;

    return (
      <div className="purchase-info-layer">
        <div className="check-area">
          <Checkbox
            onChange={e => {
              e.stopPropagation();
              onCheckAll(e.target.checked);
            }}
            checked={CheckedStatus.All === checkedStatus}
            indeterminate={CheckedStatus.INDETERMINATE === checkedStatus}
          />
          全选
          <Popconfirm
            title="确定要删除所选的商品吗?"
            onConfirm={this.handleDelete}
          >
            <a className="cart-delete">删除</a>
          </Popconfirm>
        </div>
        <div className="purchase-info">
          <span>
            <Statistic
              style={{ display: "inline-block" }}
              valueStyle={{ fontSize: 14 }}
              value={
                accountDetails && accountDetails.availableAmount
                  ? accountDetails.availableAmount
                  : 0
              }
              prefix=" 可用余额：¥"
              precision={2}
            />
          </span>
          <span>
            已选商品种类：
            <span className="text-red">{totalSelectedCategory}</span>个
          </span>
          <span>
            已选数量：<span className="text-red">{totalSelectedCount}</span>件
          </span>
          <span>
            已优惠：
            <span className="text-red">￥{totalSelectedDiscountedAmount}</span>
          </span>
          <span>
            商品总价：
            <span className="text-red total-price">
              ￥{totalSelectedAmount}
            </span>
          </span>
        </div>
        <div className="action">
          <button
            className={classnames({
              active: totalSelectedCount > 0
            })}
            onClick={() => {
              totalSelectedCount > 0 && this.handleSettlement();
            }}
          >
            去结算
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(PurchaseInfoLayer);
