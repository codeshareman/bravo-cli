import React, { FC } from "react";
import Counter from "@/components/Counter";
import { ItemInfo } from "@/api/service/ProductService";
type P = {
  item: ItemInfo;
  onChange(item: ItemInfo, count: number);
};

const SpecItem: FC<P> = props => {
  if (!props || !props.item) {
    return null;
  }
  return (
    <li className="sku-list-item">
      <div className="sku-list-item-title">
        <img
          src={props.item && props.item.pictures ? props.item.pictures[0] : ""}
          alt={props.item.itemName}
        />
        <p>
          <span>{props.item.itemName}</span>
          <span>{props.item.itemId}</span>
        </p>
      </div>
      <div className="sku-list-item-price">¥{props.item.unitPrice}</div>
      <div className="sku-list-item-count">
        <Counter
          onChange={count => {
            props.onChange(props.item, count);
          }}
        />
      </div>
    </li>
  );
};

export default SpecItem;
