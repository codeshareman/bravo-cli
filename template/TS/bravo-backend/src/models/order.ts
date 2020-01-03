import { observable, autorun, computed } from 'mobx';
import { TreeLevel } from '@/components/EditOrderList/children/NestTable/type';

class Order {
  @observable checkedAll = false;
  @observable indeterminateAll = false;
  checkedList = [];
  @observable statistics = {
    prouctCate: 0,
    productNum: 0,
    offer: 0,
    totalPrice: 0,
  };
  @observable orderList = [
    {
      id: 101,
      name: '上海喜马拉雅科技有限公司001',
      children: [
        {
          id: 10101,
          name: '小雅AI音箱',
          total: 100,
          totalPrice: '55,920.00',
          children: [
            {
              id: 101011,
              skuName: '小雅AI音箱_A',
              coverPath:
                'http://fdfs.xmcdn.com/group49/M00/34/04/wKgKl1uvLmTzUR0PAAk2139p2ts080.jpg',
              skuNum: '301020000021',
              unitPrice: 699,
              total: 80,
              discount: 7,
              offer: 100,
              price: 599,
            },
            {
              id: 101012,
              skuName: '小雅AI音箱_A',
              coverPath:
                'http://fdfs.xmcdn.com/group49/M00/34/04/wKgKl1uvLmTzUR0PAAk2139p2ts080.jpg',
              skuNum: '301020000021',
              unitPrice: 699,
              total: 80,
              discount: 7,
              offer: 100,
              price: 599,
            },
          ],
        },
        {
          id: 10102,
          name: '小雅AI音箱12312',
          total: 100,
          totalPrice: '55,920.00',
          children: [
            {
              id: 101021,
              skuName: '小雅AI音箱_A',
              coverPath:
                'http://fdfs.xmcdn.com/group49/M00/34/04/wKgKl1uvLmTzUR0PAAk2139p2ts080.jpg',
              skuNum: '301020000021',
              unitPrice: 699,
              total: 80,
              discount: 7,
              offer: 100,
              price: 599,
            },
            {
              id: 101022,
              skuName: '小雅AI音箱_A',
              coverPath:
                'http://fdfs.xmcdn.com/group49/M00/34/04/wKgKl1uvLmTzUR0PAAk2139p2ts080.jpg',
              skuNum: '301020000021',
              unitPrice: 699,
              total: 80,
              discount: 7,
              offer: 100,
              price: 599,
            },
          ],
        },
      ],
    },
    {
      id: 102,
      name: '上海喜马拉雅科技有限公司002',
      children: [
        {
          id: 10201,
          name: '小雅AI音箱',
          total: 1021,
          totalPrice: '55,920.00',
          children: [
            {
              id: 102011,
              skuName: '小雅AI音箱_A',
              coverPath:
                'http://fdfs.xmcdn.com/group49/M00/34/04/wKgKl1uvLmTzUR0PAAk2139p2ts080.jpg',
              skuNum: '301020000021',
              unitPrice: 699,
              total: 80,
              discount: 7,
              offer: 100,
              price: 599,
            },
          ],
        },
      ],
    },
  ];

  // 根据层级过滤数据源
  filterDataSourceByLevelAndStatus = (
    checked: boolean = false,
    level: TreeLevel = TreeLevel.FIRST,
    tid?: number,
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
                    checked,
                  };
                }),
              };
            }),
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
                      checked,
                    };
                  }),
                };
              }),
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
                    checked,
                  };
                }),
              };
            } else {
              return spu;
            }
          });
          dataSource.push({
            ...item,
            checked: this.getParentCheckStatus(children),
            children,
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
                  checked: sku.id === tid ? checked : sku.checked,
                };
              });
              return {
                ...spu,
                checked: this.getParentCheckStatus(children),
                children: skuList.map((sku, index: number) => {
                  return {
                    ...sku,
                    checked: sku.id === tid ? checked : sku.checked,
                  };
                }),
              };
            }),
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
    this.indeterminateAll = checkedList.length < dataSource.length && checkedList.length > 0;
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
        indeterminate: ~firstLevelChecked.indexOf(1) && !this.getParentCheckStatus(item.children),
        children: item.children.map((spu, index) => {
          const secondLevelChecked = [];
          spu.children.forEach((item, index) => {
            secondLevelChecked.push(~~item.checked);
          });
          return {
            ...spu,
            checked: this.getParentCheckStatus(spu.children),
            indeterminate:
              ~secondLevelChecked.indexOf(1) && !this.getParentCheckStatus(spu.children),
            children: spu.children.map((sku, index) => {
              return sku;
            }),
          };
        }),
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
    console.log(this.getCheckedList(curOrderList), '=====');
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
          children: this.getCheckedList(item.children),
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
