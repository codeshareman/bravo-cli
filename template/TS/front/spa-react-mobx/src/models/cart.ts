import { observable, action, computed } from "mobx";
import {
  PurchaseProductGroupDetail,
  PurchaseProductItemDetail
} from "@/api/service/CartService";
import { CheckedStatus, HTTP_STATUS } from "@/shared/common/constants";
import Api from "@/api";

class Cart {
  //采购单中总数量
  @observable total: number = 0;

  @observable productList: IProduct4Order[] = [];

  //已选中的商品总数量
  @computed get totalSelectedCount() {
    let totalCount = 0;
    this.productList.forEach(p => {
      p.productItemDetails.forEach(d => {
        //统计被选中的
        if (d.checked) {
          totalCount += d.quantity;
        }
      });
    });
    return totalCount;
  }

  @computed get checkedStatus() {
    if (this.totalSelectedCategory === 0) {
      return CheckedStatus.NON;
    } else if (this.totalSelectedCategory === this.totalCategory) {
      return CheckedStatus.All;
    } else {
      return CheckedStatus.INDETERMINATE;
    }
  }

  //所有种类
  @computed get totalCategory() {
    let totalCategory = 0;
    this.productList.forEach(p => {
      p.productItemDetails.forEach(d => {
        totalCategory += 1;
      });
    });
    return totalCategory;
  }

  //已选中的商品总金额
  @computed get totalSelectedAmount() {
    let totalAmount = 0;
    this.productList.forEach(p => {
      p.productItemDetails.forEach(d => {
        //统计被选中的
        if (d.checked) {
          totalAmount += d.quantity * d.purchasePrice;
        }
      });
    });
    return totalAmount;
  }

  //已选中的商品总优惠金额
  @computed get totalSelectedDiscountedAmount() {
    let totalDiscountedAmount = 0;
    this.productList.forEach(p => {
      p.productItemDetails.forEach(d => {
        //统计被选中的
        if (d.checked) {
          totalDiscountedAmount += d.quantity * (d.price - d.purchasePrice);
        }
      });
    });
    return totalDiscountedAmount;
  }

  //已选中的商品种类
  @computed get totalSelectedCategory() {
    let totalCategory = 0;
    this.productList.forEach(p => {
      p.productItemDetails.forEach(d => {
        //统计被选中的
        if (d.checked) {
          totalCategory += 1;
        }
      });
    });
    return totalCategory;
  }

  @action setTotal = total => {
    this.total = total;
  };

  @action setProductList = productList => {
    sessionStorage.setItem("productList", JSON.stringify(productList));
    this.productList = productList;
  };

  @action onCheckAll = _checked => {
    const list = this.productList.map(
      ({ checked, checkedStatus, productItemDetails, ...rest }) => {
        const itemDetails = productItemDetails.map(({ checked, ...rest }) => {
          return {
            checked: _checked,
            ...rest
          };
        });
        return {
          checked: _checked,
          checkedStatus: _checked ? CheckedStatus.All : CheckedStatus.NON,
          productItemDetails: itemDetails,
          ...rest
        };
      }
    );
    this.setProductList(list);
  };

  @action asyncUpdateTotal = () => {
    Api.cart.total().then(r => {
      if (HTTP_STATUS.SUCCESSS === r.code) {
        this.setTotal(r.data);
      }
    });
  };
}

export default new Cart();

export type ICart = {
  total: number;
  totalSelectedCount: number;
  totalSelectedAmount: number;
  totalSelectedDiscountedAmount: number;
  totalSelectedCategory: number;
  checkedStatus: CheckedStatus;
  productList: IProduct4Order[];
  setTotal(total: number);
  setProductList(productList: IProduct4Order[]);
  onCheckAll(checked: boolean);
  asyncUpdateTotal()
};

export type IProductItem4Cart = PurchaseProductItemDetail & {
  checked?: boolean;
  checkedStatus?: CheckedStatus;
};
export type IProduct4Order = {
  checked?: boolean;
  checkedStatus?: CheckedStatus;
  productItemDetails: IProductItem4Cart[];
} & PurchaseProductGroupDetail;
