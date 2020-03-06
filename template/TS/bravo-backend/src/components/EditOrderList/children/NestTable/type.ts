export type ColItemType = {
  title: string;
  dataIndex: string;
  key: string;
  render?(curVal: any, index: number, item?: any): any;
};

export enum TreeLevel {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOUR = 4,
}

import {
  PurchaseProductItemDetail,
  PurchaseProductGroupDetail,
} from '@xmly/cbp-spec/lib/portal/service/provider/CartService';

//选中状态
export const enum CheckedStatus {
  NON, //全部未选中
  All, //全部选中
  INDETERMINATE, //部分选中
}

export type IProductItem4Cart = PurchaseProductItemDetail & {
  checked?: boolean;
  checkedStatus?: CheckedStatus;
};

export type IProduct4Order = {
  checked?: boolean;
  checkedStatus?: CheckedStatus;
  productItemDetails: IProductItem4Cart[];
} & PurchaseProductGroupDetail;

export const enum CartStatisticsType {
  All, //统计所有
  SELECTED, //统计选中的数量
}
