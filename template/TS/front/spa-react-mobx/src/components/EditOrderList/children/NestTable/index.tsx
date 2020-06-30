import React, { FC, useState, useEffect } from "react";
import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import SkuList from "./SkuList";
import { IProduct4Order, IProductItem4Cart } from "@/models/cart";
import { CheckedStatus } from "@/shared/common/constants";
import { multi } from "@/shared/common/utils";
import "./index.scss";

type P = {
  checkable?: boolean;
  dataSource: IProduct4Order[];
  onChange?(list: IProduct4Order[]);
};

const NestTable: FC<P> = props => {
  const { dataSource, checkable } = props;

  const _onChange = (product: IProduct4Order) => {
    const temp = [];
    props.dataSource.forEach(i => {
      if (i.productId === product.productId) {
        temp.push(product);
      } else {
        temp.push(i);
      }
    });
    props.onChange && props.onChange(temp);
  };

  const getSelectedInfo = (item: IProduct4Order) => {
    let selectedCount = 0,
      selectedPrice = 0;
    item.productItemDetails.forEach((i: IProductItem4Cart) => {
      if (i.checked) {
        selectedCount += i.quantity;
        selectedPrice += multi(i.quantity, i.purchasePrice);
      }
    });
    return [selectedCount, selectedPrice];
  };

  if (!dataSource) {
    return null;
  }
  return (
    <>
      {dataSource.map((item: IProduct4Order, index: number) => {
        const [selectedCount, selectedPrice] = getSelectedInfo(item);
        return (
          <div className="nest-table-wrapper" key={`spu-${index}`}>
            <div className="spu-item">
              <div className="spu-info">
                {checkable ? (
                  <Checkbox
                    indeterminate={
                      CheckedStatus.INDETERMINATE === item.checkedStatus
                    }
                    checked={CheckedStatus.All === item.checkedStatus}
                    onChange={(e: CheckboxChangeEvent) => {
                      const { checked } = e.target;
                      const _list = item.productItemDetails.map(i => {
                        i.checked = checked;
                        return i;
                      });
                      const _item = Object.assign({}, item, {
                        checked,
                        checkedStatus: checked
                          ? CheckedStatus.All
                          : CheckedStatus.NON,
                        productItemDetails: _list
                      });
                      _onChange(_item);
                    }}
                  />
                ) : null}

                <span>{item.name}</span>
                <span>{checkable ? selectedCount : item.totalQuantity}件</span>
                <span>
                  小计：￥{checkable ? selectedPrice : item.totalAmount}
                </span>
              </div>
              <SkuList
                checkable={checkable}
                list={item.productItemDetails}
                onChange={(list, checkedStatus, totalQuantity, totalAmount) => {
                  const _item = Object.assign({}, item, {
                    productItemDetails: list,
                    checkedStatus,
                    totalQuantity,
                    totalAmount
                  });
                  _onChange(_item);
                }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default NestTable;
