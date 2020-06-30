import React from "react";
import { Checkbox } from "antd";
import { IProductItem4Cart } from "@/models/cart";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import Counter from "@/components/Counter";
import { CheckedStatus, CartStatisticsType } from "@/shared/common/constants";

type P = {
  cartStatisticsType?: CartStatisticsType;
  checkable?: boolean; //是否开启选择框
  list: IProductItem4Cart[];
  onChange?(
    item: IProductItem4Cart[],
    status: CheckedStatus,
    totalQuantity: number,
    totalAmount
  );
};

export default function SkuList(props: P) {
  //处理选中 或 数量变化的状态
  const onChange = (_item: IProductItem4Cart) => {
    const { list } = props;

    let checkedCount = 0,
      totalQuantity = 0,
      totalAmount = 0;

    const temp = [];
    list.forEach(i => {
      if (i.productItemId === _item.productItemId) {
        temp.push(_item);
        if (
          CartStatisticsType.SELECTED === props.cartStatisticsType &&
          _item.checked
        ) {
          _item.checked && ++checkedCount;
          totalQuantity += _item.quantity;
          totalAmount += _item.quantity * _item.purchasePrice;
        } else {
          _item.checked && ++checkedCount;
          totalQuantity += _item.quantity;
          totalAmount += _item.quantity * _item.purchasePrice;
        }
      } else {
        temp.push(i);
        i.checked && ++checkedCount;
        totalQuantity += i.quantity;
        totalAmount += i.quantity * i.purchasePrice;
      }
    });
    const status =
      checkedCount === 0
        ? CheckedStatus.NON
        : checkedCount === list.length
        ? CheckedStatus.All
        : CheckedStatus.INDETERMINATE;
    props.onChange && props.onChange(temp, status, totalQuantity, totalAmount);
  };

  if (!props.list || !props.list.length) {
    return null;
  }

  return (
    <div className="sku-list">
      {props.list.map(item => (
        <SkuItem
          key={item.productItemId}
          checkable={props.checkable}
          item={item}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

function SkuItem({ checkable, item, onChange }) {
  return (
    <div key={item.productItemId} className="sku-item">
      {checkable ? (
        <div className="col-0">
          <Checkbox
            checked={!!item.checked}
            onChange={(e: CheckboxChangeEvent) => {
              const { checked } = e.target;
              const _item = Object.assign({}, item, {
                checked
              });
              onChange(_item);
            }}
          />
        </div>
      ) : null}

      <div className="col-1">
        <img src={item.coverUrl} alt={item.name} />
        <div className="brief-info">
          <p>{item.name}</p>
          <p className="number">{item.productItemId}</p>
        </div>
      </div>
      <div className="col-2">￥{item.price}</div>
      <div className="col-4">{item.purchasePrice}</div>
      <div className="col-3">
        {checkable ? (
          <Counter
            defaultValue={item.quantity}
            onChange={quantity => {
              const _item = Object.assign({}, item, { quantity });
              onChange(_item);
            }}
          />
        ) : (
          item.quantity
        )}
      </div>
      <div className="col-5">￥{item.totalDiscountedAmount}</div>
      <div className="col-6">￥{item.purchasePrice * item.quantity}</div>
    </div>
  );
}
