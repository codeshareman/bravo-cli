import { observable, autorun, computed } from "mobx";
import { TreeLevel } from "@/components/EditOrderList/children/NestTable/type";

class Order {
  @observable checkedAll = false;
  @observable indeterminateAll = false;
  checkedList = [];
  @observable statistics = {
    prouctCate: 0,
    productNum: 0,
    offer: 0,
    totalPrice: 0
  };
  @observable orderList = [];

  // 根据层级过滤数据源
  filterDataSourceByLevelAndStatus = (
    checked: boolean = false,
    level: TreeLevel = TreeLevel.FIRST,
    tid?: number
  ) => {
    const originData = this.orderList;
    let dataSource = [];

    originData.forEach((item: any, index) => {
      switch (level) {
        case TreeLevel.FIRST:
          item.checked = checked;
          dataSource.push({
            ...item,
            checked,
            children: item.children.map((spu, index: number) => {
              const skuList = spu.children;
              return {
                ...spu,
                checked,
                children: skuList.map((sku, index: number) => {
                  return {
                    ...sku,
                    checked
                  };
                })
              };
            })
          });
          break;
        case TreeLevel.SECOND:
          if (item.id === tid) {
            dataSource.push({
              ...item,
              checked,
              children: item.children.map((spu, index: number) => {
                const skuList = spu.children;
                return {
                  ...spu,
                  checked,
                  children: skuList.map((sku, index: number) => {
                    return {
                      ...sku,
                      checked
                    };
                  })
                };
              })
            });
          } else {
            dataSource.push(item);
          }
          break;
        case TreeLevel.THIRD:
          const children = item.children.map((spu, index: number) => {
            const skuList = spu.children;
            if (spu.id === tid) {
              return {
                ...spu,
                checked,
                children: skuList.map((sku, index: number) => {
                  return {
                    ...sku,
                    checked
                  };
                })
              };
            } else {
              return spu;
            }
          });
          dataSource.push({
            ...item,
            checked: this.getParentCheckStatus(children),
            children
          });
          break;
        case TreeLevel.FOUR:
          dataSource.push({
            ...item,
            children: item.children.map((spu, index: number) => {
              const skuList = spu.children;
              const children = skuList.map((sku, index: number) => {
                return {
                  ...sku,
                  checked: sku.id === tid ? checked : sku.checked
                };
              });
              return {
                ...spu,
                checked: this.getParentCheckStatus(children),
                children: skuList.map((sku, index: number) => {
                  return {
                    ...sku,
                    checked: sku.id === tid ? checked : sku.checked
                  };
                })
              };
            })
          });
          break;
      }
    });
    this.refreshDataSource(dataSource);
  };

  // 更新全选状态
  refreshCheckAllStatus = (dataSource: any) => {
    const checkedList = dataSource.filter(item => item.checked);
    this.checkedAll = checkedList.length === dataSource.length;
    this.indeterminateAll =
      checkedList.length < dataSource.length && checkedList.length > 0;
  };

  // 获取父级选择状态
  getParentCheckStatus = (dataSource: any) => {
    const checkedList = dataSource.filter(item => item.checked);
    return checkedList.length === dataSource.length;
  };

  // 动态更新数据源
  refreshDataSource = (dataSource: any) => {
    const curDataSource = dataSource.map((item, index) => {
      const firstLevelChecked = [];
      item.children.forEach((item, index) => {
        firstLevelChecked.push(~~item.checked);
        item.children.forEach((sku, index) => {
          firstLevelChecked.push(~~sku.checked);
        });
      });
      return {
        ...item,
        checked: this.getParentCheckStatus(item.children),
        indeterminate:
          ~firstLevelChecked.indexOf(1) &&
          !this.getParentCheckStatus(item.children),
        children: item.children.map((spu, index) => {
          const secondLevelChecked = [];
          spu.children.forEach((item, index) => {
            secondLevelChecked.push(~~item.checked);
          });
          return {
            ...spu,
            checked: this.getParentCheckStatus(spu.children),
            indeterminate:
              ~secondLevelChecked.indexOf(1) &&
              !this.getParentCheckStatus(spu.children),
            children: spu.children.map((sku, index) => {
              return sku;
            })
          };
        })
      };
    });

    this.setCurOrderList(curDataSource);
    this.refreshCheckAllStatus(curDataSource);
  };

  updateCheckedALlStatus = (checked: boolean) => {
    this.checkedAll = checked;
  };

  setCurOrderList = (curOrderList: Array<any>) => {
    this.orderList = curOrderList;
    console.log(this.getCheckedList(curOrderList), "=====");
    console.log(this.getOrderStats());
  };

  // 获取当前选中的商品信息
  getCheckedList = (dataSource: Array<any>) => {
    const itemData = dataSource.map((item, index) => {
      if (item.checked) {
        return item;
      }
      if (item.indeterminate) {
        return {
          ...item,
          children: this.getCheckedList(item.children)
        };
      }
    });
    return itemData.filter(item => item);
  };

  // 获取所选订单信息
  getOrderStats = () => {
    let spuCount = 0;
    this.checkedList.map((item, index) => {
      item.children.map((spu, index) => {
        const spuChecked = spu.children.filter(sku => sku.checked).length > 0;
        spuChecked && spuCount++;
      });
    });
    console.log(spuCount);
  };
}

export default new Order();
