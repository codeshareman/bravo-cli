import * as React from "react";
import { Table, Checkbox } from "antd";
import NestTable from "./children/NestTable";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { TreeLevel } from "./children/NestTable/type";
import { IProduct4Order } from "@/models/cart";
import "./index.scss";

type P = {
  checkable?: boolean; //是否开始选择框
};
type S = {
  dataSource: IProduct4Order[];
  checkedAll: boolean;
  indeterminate: boolean;
};

class NestOrderList extends React.Component<P, S> {
  readonly state: S = {
    checkedAll: false,
    indeterminate: false,
    dataSource: []
  };

  getTableProps = () => {
    const { dataSource } = this.state;
    const columns = [
      {
        key: "product",
        dataIndex: "product",
        title: "商品",
        width: 250,
        render: product => {
          return (
            <div className="product-info">
              <div className="left">
                <img className="product-cover" src={product.imgUrl} />
              </div>
              <div className="right">
                <p>{product.name}</p>
                <p className="product-num">{product.num}</p>
              </div>
            </div>
          );
        }
      },
      {
        key: "unitPrice",
        dataIndex: "unitPrice",
        width: 150,
        title: "单价"
        // render: curVal => {
        //   const price = curVal.toFixed(2).toString();
        //   return '￥' + price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // },
      },
      {
        key: "shopNum",
        dataIndex: "shopNum",
        width: 150,
        title: "商品数量"
      },
      {
        key: "discount",
        dataIndex: "discount",
        width: 150,
        title: "享受折扣"
      },
      {
        key: "offer",
        dataIndex: "offer",
        title: "优惠",
        width: 150
      },
      {
        key: "price",
        dataIndex: "price",
        title: "金额",
        width: 150
        // render: curVal => {
        //   const price = curVal.toFixed(2).toString();
        //   return '￥' + price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // },
      }
    ];

    return {
      dataSource,
      columns,
      rowKey: "id",
      pagination: false
    };
  };

  onChange = (e: CheckboxChangeEvent, level: TreeLevel) => {
    const checked = e.target.checked;

    this.filterDataSourceByLevelAndStatus(checked, level);
    this.setState({
      checkedAll: checked
    });
  };

  // 根据层级过滤数据源
  filterDataSourceByLevelAndStatus = (
    checked: boolean = false,
    level: TreeLevel = TreeLevel.FIRST,
    tid?: number
  ) => {
    // const originData = [...this.state.dataSource];
    // let dataSource = [];
    // originData.forEach((item, index) => {
    //   switch (level) {
    //     case TreeLevel.FIRST:
    //       item.checked = checked;
    //       dataSource.push({
    //         ...item,
    //         checked,
    //         product: item.product.map((spu, index: number) => {
    //           const skuList = spu.children;
    //           return {
    //             ...spu,
    //             checked,
    //             children: skuList.map((sku, index: number) => {
    //               return {
    //                 ...sku,
    //                 checked
    //               };
    //             })
    //           };
    //         })
    //       });
    //       break;
    //     case TreeLevel.SECOND:
    //       if (item.id === tid) {
    //         dataSource.push({
    //           ...item,
    //           checked,
    //           product: item.product.map((spu, index: number) => {
    //             const skuList = spu.children;
    //             return {
    //               ...spu,
    //               checked,
    //               children: skuList.map((sku, index: number) => {
    //                 return {
    //                   ...sku,
    //                   checked
    //                 };
    //               })
    //             };
    //           })
    //         });
    //       } else {
    //         dataSource.push(item);
    //       }
    //       break;
    //     case TreeLevel.THIRD:
    //       const product = item.product.map((spu, index: number) => {
    //         const skuList = spu.children;
    //         if (spu.id === tid) {
    //           return {
    //             ...spu,
    //             checked,
    //             children: skuList.map((sku, index: number) => {
    //               return {
    //                 ...sku,
    //                 checked
    //               };
    //             })
    //           };
    //         } else {
    //           return spu;
    //         }
    //       });
    //       dataSource.push({
    //         ...item,
    //         checked: this.getParentCheckStatus(product),
    //         product
    //       });
    //       break;
    //     case TreeLevel.FOUR:
    //       dataSource.push({
    //         ...item,
    //         product: item.product.map((spu, index: number) => {
    //           const skuList = spu.children;
    //           const children = skuList.map((sku, index: number) => {
    //             return {
    //               ...sku,
    //               checked: sku.id === tid ? checked : sku.checked
    //             };
    //           });
    //           return {
    //             ...spu,
    //             checked: this.getParentCheckStatus(children),
    //             children: skuList.map((sku, index: number) => {
    //               return {
    //                 ...sku,
    //                 checked: sku.id === tid ? checked : sku.checked
    //               };
    //             })
    //           };
    //         })
    //       });
    //       break;
    //   }
    // });
    // this.refreshDataSource(dataSource);
  };

  // 更新全选状态
  refreshCheckAllStatus = (dataSource: any) => {
    const checkedList = dataSource.filter(item => item.checked);
    this.setState({
      checkedAll: checkedList.length === dataSource.length,
      indeterminate:
        checkedList.length < dataSource.length && checkedList.length > 0
    });
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
      item.product.forEach((item, index) => {
        firstLevelChecked.push(~~item.checked);
        item.children.forEach((sku, index) => {
          firstLevelChecked.push(~~sku.checked);
        });
      });
      return {
        ...item,
        checked: this.getParentCheckStatus(item.product),
        indeterminate:
          ~firstLevelChecked.indexOf(1) &&
          !this.getParentCheckStatus(item.product),
        product: item.product.map((spu, index) => {
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

    this.setState(
      {
        dataSource: curDataSource
      },
      () => {
        this.refreshCheckAllStatus(this.state.dataSource);
      }
    );
  };

  renderThead = () => {
    const columns = [
      {
        key: "product",
        dataIndex: "product",
        title: "商品",
        width: 250,
        render: product => {
          return (
            <div className="product-info">
              <div className="left">
                <img className="product-cover" src={product.imgUrl} />
              </div>
              <div className="right">
                <p>{product.name}</p>
                <p className="product-num">{product.num}</p>
              </div>
            </div>
          );
        }
      },
      {
        key: "unitPrice",
        dataIndex: "unitPrice",
        width: 150,
        title: "单价",
        render: curVal => {
          const price = curVal.toFixed(2).toString();
          return "￥" + price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      },
      {
        key: "quantity",
        dataIndex: "quantity",
        width: 150,
        title: "商品数量"
      },
      {
        key: "discount",
        dataIndex: "discount",
        width: 150,
        title: "享受折扣"
      },
      {
        key: "offer",
        dataIndex: "offer",
        title: "优惠",
        width: 150
      },
      {
        key: "price",
        dataIndex: "price",
        title: "金额",
        width: 150,
        render: curVal => {
          const price = curVal.toFixed(2).toString();
          return "￥" + price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      }
    ];

    return columns.map((item, index) => {
      return (
        <div key={item.key} className={`col-${index + 1}`}>
          {item.title}
        </div>
      );
    });
  };

  // 渲染嵌套表格
  renderNestTableList = () => {
    const { dataSource } = this.state;
    return dataSource.map((item, index: number) => {
      return (
        <NestTable
          key={item.productId}
          dataSource={item}
          onFilterData={this.filterDataSourceByLevelAndStatus}
        />
      );
    });
  };

  render() {
    const { checkable } = this.props;
    console.log({ checkable }, "------");
    return (
      <div className="nest-order-table">
        <div className="tb-header">
          {checkable ? (
            <div key={"check-all"} className={`col-0`}>
              <Checkbox
                indeterminate={this.state.indeterminate}
                checked={this.state.checkedAll}
                onChange={e => this.onChange(e, TreeLevel.FIRST)}
              />
              <span className="label">全选</span>
            </div>
          ) : null}

          {this.renderThead()}
        </div>
        <div className="tb-body">{this.renderNestTableList()}</div>
      </div>
    );
  }
}

export default NestOrderList;
