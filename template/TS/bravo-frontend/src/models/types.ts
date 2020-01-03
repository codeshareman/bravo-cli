import { TreeLevel } from '../components/EditOrderList/children/NestTable/type';

export type OrderStoreType = {
  orderList: Array<any>;
  checkedAll: boolean;
  indeterminateAll: boolean;
  statistics: {
    prouctCate: number,
    productNum: number,
    offer: number,
    totalPrice: number,
  };
  updateCheckedALlStatus(checked: boolean): void;
  filterDataSourceByLevelAndStatus(checked: boolean, level: TreeLevel, tid?: number): void;
};
