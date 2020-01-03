import * as React from 'react';
import { Modal, Form, Checkbox, Button, Input, message } from 'antd';
import cx from 'classnames';
import { FormComponentProps } from 'antd/lib/form';
import { ModalProps } from 'antd/lib/modal';

import './index.scss';
import { limitWord } from '@/shared/common/utils';
import { ChannelProduct, Character } from '@/client/portal/service/oss/ChannelStrategyService';
import { PriceModalType } from '../PriceModal/type';
import { Price } from './helper';

type P = ModalProps &
  FormComponentProps & {
    type: PriceModalType;
    visible: boolean;
    dataSource: Array<ChannelProduct>;
    columns: any;
    currentRole?: Character;
    onConfirm(): any;
    extral?: any;
  };
type S = {
  dataSource: Array<any>;
};

// 设置特殊价、价盘价弹窗
class PriceSetMoal extends React.Component<P, S> {
  readonly state: S = {
    dataSource: [],
  };

  componentDidMount() {}

  componentWillReceiveProps(nextProps: P) {
    this.setState({
      dataSource: nextProps.dataSource,
    });
  }

  // 改变选中状态
  changeCheckStatus = (e, rowData: any) => {
    const { dataSource } = this.state;
    const idStr = String(rowData.id);
    const checked = e.target.checked;
    let curDatasource = [];

    // 一级
    if (rowData.productId) {
      rowData.checked = checked;
      rowData.indeterminate = false;
      rowData.items = rowData.items.map((item, index) => {
        return {
          ...item,
          checked,
        };
      });
      curDatasource = Price.getChangedDataSource(rowData.id, dataSource, rowData);
    } else {
      let checkCount = 0;
      const spu = Price.getSpuBasedOnSkuId(dataSource, rowData.id);
      const skuList = spu.items;
      let isCheckedAll = false;

      rowData.checked = checked;
      skuList.forEach(item => {
        if (item.checked) checkCount++;
      });

      isCheckedAll = skuList.length === checkCount;
      spu.checked = isCheckedAll;
      spu.indeterminate = !isCheckedAll && checkCount > 0;
      curDatasource = Price.getChangedDataSource(spu.id, dataSource, spu);
    }

    this.setState({
      dataSource: curDatasource,
    });
  };

  renderTableHead = () => {
    const { columns } = this.props;
    return (
      columns &&
      columns.map((item, index) => {
        return (
          <div key={item.key} className={`col-${index}`}>
            {item.title}
          </div>
        );
      })
    );
  };

  renderTableBody = () => {
    const { dataSource } = this.state;
    const { columns, type } = this.props;
    const lastColumn = columns[columns.length - 1];
    const lastKey = lastColumn.dataIndex;
    return (
      dataSource &&
      dataSource.map((spu, spuIndex: number) => {
        const skuList = spu.items;
        return (
          <div key={spuIndex} className="product">
            <div className="table">
              {/* <div className="row-spu">
                {columns.map((column: any, index) => {
                  const key = column.dataIndex;
                  if (index === 0) {
                    return (
                      <div key={index} className={`col-${index}`}>
                        <Checkbox
                          checked={spu.checked}
                          indeterminate={spu.indeterminate}
                          onChange={e => this.changeCheckStatus(e, spu)}
                        ></Checkbox>
                        <span className="name">{spu.productName}</span>
                      </div>
                    );
                  } else {
                    const renderLimit =
                    type === PriceModalType.SPECIAL
                      ? index < columns.length - 1
                      : index <= columns.length - 1;
                    return renderLimit ? (
                      <div key={index} className={`col-${index}`}>
                        {column.render ? column.render(spu[key], spu, index) : spu[key]}
                      </div>
                    ) : null;
                  }
                })}
              </div> */}
              {skuList.map((sku: any, index: number) => {
                return (
                  <div key={index} className="row-sku">
                    {columns.map((column, index) => {
                      const key = column.dataIndex;
                      if (index === 0) {
                        return (
                          <div key={index} className={`col-${index}`}>
                            {/* <Checkbox
                              checked={sku.checked}
                              indeterminate={sku.indeterminate}
                              onChange={e => this.changeCheckStatus(e, sku)}
                            ></Checkbox> */}
                            <div className="sku-info">
                              <div className="cover">
                                <img src={sku.coverPath} />
                              </div>
                              <div className="info">
                                <div className="title">
                                  {sku.itemName ? limitWord(sku.itemName, 18) : '无'}
                                </div>
                                <div className="desc">商品ID：{sku.itemId}</div>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        const renderLimit =
                          type === PriceModalType.SPECIAL
                            ? index < columns.length - 1
                            : index <= columns.length - 1;
                        return renderLimit ? (
                          <div key={index} className={`col-${index}`}>
                            {column.render ? column.render(sku[key], sku, index) : sku[key]}
                          </div>
                        ) : null;
                      }
                    })}
                  </div>
                );
              })}
              {type === PriceModalType.SPECIAL && (
                <div className="col-expire">
                  {lastColumn.render
                    ? lastColumn.render(spu[lastKey], spu, spuIndex)
                    : spu[lastKey]}
                </div>
              )}
            </div>
            {/* <div className="actions">
              <Button type="primary">设置统一价</Button>
            </div> */}
          </div>
        );
      })
    );
  };

  render() {
    const {
      visible,
      title,
      onCancel,
      onConfirm,
      width = 800,
      currentRole,
      type,
      extral = null,
    } = this.props;
    return (
      <Modal
        width={width}
        title={title}
        visible={visible}
        onCancel={onCancel}
        onOk={onConfirm}
        maskClosable={false}
        destroyOnClose
      >
        <div className="spu-detail">
          <div className="company-info">
            {/* <div>
              <span>渠道：</span> 广州那啥公司
            </div> */}
            <div>
              <span>角色：</span> {currentRole && currentRole.name}
            </div>
          </div>
          <div className="modal-priceset">
            <div
              className={cx({
                'tb-head': true,
                'tb-head--special': type === PriceModalType.SPECIAL,
              })}
            >
              {this.renderTableHead()}
            </div>
            <div
              className={cx({
                'tb-body': true,
                'tb-body--special': type === PriceModalType.SPECIAL,
              })}
            >
              {this.renderTableBody()}
              {this.props.extral}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default Form.create<P>()(PriceSetMoal);
