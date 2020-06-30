import * as React from 'react';
import { Checkbox } from 'antd';

import './index.scss';
import { ColItemType, TreeLevel } from './type';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

type P = {
  key: number | string;
  dataSource: any;
  onFilterData?: (checked: boolean, level: TreeLevel, id: number) => void;
  // columns: Array<ColItemType>;
};
type S = {};

class NestTable extends React.Component<P, S> {
  render() {
    const { dataSource } = this.props;
    return (
      <div className="nest-table-wrapper">
        <div className="merchant">
          <Checkbox
            indeterminate={dataSource.indeterminate}
            checked={dataSource.checked}
            onChange={(e: CheckboxChangeEvent) =>
              this.props.onFilterData(e.target.checked, TreeLevel.SECOND, dataSource.id)
            }
          />
          <span className="merchant-name">{dataSource.merchant}</span>
        </div>
        {dataSource.children.map((item: any, index: number) => {
          const spu = item;
          const skuList = spu.children;
          return (
            <div key={`spu-${index}`} className="spu-item">
              <div className="spu-info">
                <Checkbox
                  indeterminate={item.indeterminate}
                  checked={item.checked}
                  onChange={(e: CheckboxChangeEvent) =>
                    this.props.onFilterData(e.target.checked, TreeLevel.THIRD, item.id)
                  }
                />
                <span>{spu.name}</span>
                <span>{spu.total}件</span>
                <span>小计：￥{spu.totalPrice}</span>
              </div>
              <div className="sku-list">
                {skuList.map((sku: any, index: number) => {
                  return (
                    <div key={`sku-${index}`} className="sku-item">
                      <div className="col-0">
                        <Checkbox
                          checked={sku.checked}
                          onChange={(e: CheckboxChangeEvent) =>
                            this.props.onFilterData(e.target.checked, TreeLevel.FOUR, sku.id)
                          }
                        />
                      </div>
                      <div className="col-1">
                        <img src={sku.coverPath} alt={sku.skuName} />
                        <div className="brief-info">
                          <p>{sku.skuName}</p>
                          <p className="number">{sku.skuNum}</p>
                        </div>
                      </div>
                      <div className="col-2">￥{sku.unitPrice}</div>
                      <div className="col-3">{sku.total}</div>
                      <div className="col-4">{sku.discount}</div>
                      <div className="col-5">￥{sku.offer}</div>
                      <div className="col-6">￥{sku.price}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default NestTable;
