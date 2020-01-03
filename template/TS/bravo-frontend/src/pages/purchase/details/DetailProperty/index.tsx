import React, { Component } from "react";
import { Typography, Divider, Button, Statistic, message } from "antd";
import { observer, inject } from "mobx-react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {
  Product,
  SpecAttributes,
  ItemInfo
} from "@/api/service/ProductService";
import { PurchaseProductGroup } from "@/api/service/CartService";
import SpecItem from "./SpecItem";
import { multi } from "@/shared/common/utils";
import { HTTP_STATUS } from "@/shared/common/constants";
import classnames from "classnames";
import { ICart } from "@/models/cart";
import { PurchaseMethod } from "@/api/service/PurchaseService";
import Api from "@/api";

import "./index.scss";

type P = RouteComponentProps & {
  product: Product;
  attributes: SpecAttributes[];
  cartStore?: ICart;
};

type IitemSelected = ItemInfo & { count: number };

type S = {
  selectedCount: number;
  selectedPrice: number;
  itemSelected: IitemSelected[];
};
const { Paragraph, Text, Title } = Typography;

@inject("cartStore")
@observer
class DetailProperty extends Component<P, S> {
  constructor(props) {
    super(props);
    this.state = {
      itemSelected: [],
      selectedCount: 0,
      selectedPrice: 0
    };
  }

  specItemOnChange = (item: ItemInfo, count: number) => {
    const { itemSelected } = this.state;
    if (itemSelected && itemSelected.length) {
      let selectedPrice = 0,
        selectedCount = 0,
        itemSelectedTemp = [],
        //是否是新加入的商品
        isNew = true;
      itemSelected.forEach(i => {
        if (item.itemId === i.itemId) {
          itemSelectedTemp.push({
            ...item,
            count
          });
          selectedPrice += multi(Number(item.unitPrice), count);
          selectedCount += count;
          isNew = false;
        } else {
          itemSelectedTemp.push(i);
          selectedPrice += multi(Number(i.unitPrice), i.count);
          selectedCount += i.count;
        }
      });
      if (isNew) {
        itemSelectedTemp.push({ ...item, count });
        selectedPrice += multi(Number(item.unitPrice), count);
        selectedCount += count;
      }

      this.setState({
        selectedPrice,
        selectedCount,
        itemSelected: itemSelectedTemp
      });
    } else {
      this.setState({
        selectedPrice: item.unitPrice
          ? multi(Number(item.unitPrice), count)
          : 0,
        selectedCount: count,
        itemSelected: [
          {
            ...item,
            count
          }
        ]
      });
    }
  };

  addCart = async () => {
    const { product } = this.props;
    const { itemSelected = [] } = this.state;
    if (itemSelected && itemSelected.length) {
      const productItemPairs = [];
      itemSelected.forEach(item => {
        if (item.count > 0) {
          productItemPairs.push({
            productItemId: item.itemId,
            quantity: item.count
          });
        }
      });
      const params: PurchaseProductGroup = {
        productId: product.id,
        productItemPairs
      };
      const res = await Api.cart.add([params]);
      if (HTTP_STATUS.SUCCESSS !== res.code) {
        message.error(res.message);
        return false;
      }
      message.success("添加成功");
      //更新采购单信息
      this.props.cartStore.asyncUpdateTotal();
    } else {
      message.info("请先选择商品");
    }
  };

  buyNow = () => {
    const { product } = this.props;
    const { itemSelected = [] } = this.state;
    if (itemSelected && itemSelected.length) {
      const productItemPairs = itemSelected.map(item => {
        return {
          productItemId: item.itemId,
          quantity: item.count
        };
      });
      const params: PurchaseProductGroup = {
        productId: product.id,
        productItemPairs
      };

      console.log({ params });

      this.props.history.push({
        pathname: "/purchase/settlement/order",
        state: {
          products: [params],
          purchaseMethod: PurchaseMethod.DIRECT
        }
      });
    } else {
      message.info("请先选择商品");
    }
  };

  renderBuyingPrice = () => {
    const { product } = this.props;
    if (!product) {
      return "--";
    } else if (product.minPrice !== product.maxPrice) {
      return (
        <>
          <Statistic
            className="price"
            prefix={"¥"}
            value={product ? product.minPrice : 0}
            precision={2}
          ></Statistic>
          <span>～</span>
          <Statistic
            className="price"
            prefix={"¥"}
            value={product ? product.maxPrice : 0}
            precision={2}
          ></Statistic>
        </>
      );
    } else {
      return (
        <Statistic
          className="price"
          prefix={"¥"}
          value={product ? product.minPrice : 0}
          precision={2}
        ></Statistic>
      );
    }
  };

  render() {
    const { product, attributes } = this.props;
    const { selectedCount, selectedPrice } = this.state;
    const attributeName =
      attributes && attributes.length ? attributes[0].attributeName : "";
    //是否禁用加入采购单和立即采购按钮
    const disabled = selectedCount === 0;

    return (
      <div className="purchase-details-content-property">
        <h4 className="product-title">{product ? product.name : ""}</h4>
        <Paragraph>
          <Title level={4}>商品编码:</Title>
          <Text>{product ? product.id : ""}</Text>
        </Paragraph>
        <Paragraph className="buying-price">
          <Title level={4}>采购价格:</Title>
          {this.renderBuyingPrice()}
        </Paragraph>
        <Divider style={{ margin: "16px 0", background: "#EAEAED" }} />
        <Paragraph className="sku-warp">
          <Title level={4}>{attributeName ? attributeName : "采购规格"}</Title>
          <ul className="sku-list">
            {product && product.items && product.items.length
              ? product.items.map(item => (
                  <SpecItem
                    key={item.itemId}
                    item={item}
                    onChange={this.specItemOnChange}
                  />
                ))
              : null}
          </ul>
        </Paragraph>
        <Paragraph className="has-selected">
          <Title level={4}>已选:</Title>
          <div className="has-selected-warp">
            <span>{selectedCount}件</span>
            <span className="has-selected-warp-price">{selectedPrice}</span>
          </div>
        </Paragraph>
        <div className="purchase-details-action">
          <Button
            disabled={disabled}
            className={classnames("add-purchase-order", {
              disabled: disabled
            })}
            icon="copy"
            onClick={this.addCart}
          >
            加入采购单
          </Button>
          <Button
            disabled={disabled}
            className={classnames("buy-now", {
              disabled: disabled
            })}
            onClick={this.buyNow}
          >
            立即采购
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(DetailProperty);
