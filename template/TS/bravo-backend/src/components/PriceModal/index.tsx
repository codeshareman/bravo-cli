import * as React from 'react'
import { Modal, Form } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import cx from 'classnames'

import './index.scss'
import { optimizePic } from '@/shared/common/utils'
import { PriceModalType } from './type'
import { limitWord } from '@/shared/common/utils'
import { ChannelProduct } from '@xmly/cbp-spec/lib/portal/service/oss/ChannelStrategyService'
import { FormComponentProps } from 'antd/lib/form'

type P = ModalProps &
  FormComponentProps & {
    type: PriceModalType
    visible: boolean
    currentRole?: any
    dataSource: Array<ChannelProduct>
    columns: any
  }
type S = {}

// 设置特殊价、价盘价弹窗
class PriceModal extends React.Component<P, S> {
  readonly state: S = {}

  renderTableHead = () => {
    const { columns } = this.props
    return columns.map((item, index) => {
      return (
        <div key={item.key} className={`col-${index}`}>
          {item.title}
        </div>
      )
    })
  }

  renderTableBody = () => {
    const { dataSource, type, columns } = this.props
    const lastColumn = columns[columns.length - 1]
    const lastKey = lastColumn.dataIndex
    return (
      dataSource &&
      dataSource.map((spu, spuIndex: number) => {
        const skuList = spu.items
        return (
          <div key={spuIndex} className="product">
            <div className="table">
              {/* <div className="row-spu">
                {columns.map((column: any, index) => {
                  const key = column.dataIndex;
                  if (index === 0) {
                    return (
                      <div key={index} className={`col-${index}`}>
                        <span className="name">{spu.productName}</span>
                      </div>
                    );
                  } else {
                    return index <= columns.length - 1 ? (
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
                      const key = column.dataIndex
                      if (index === 0) {
                        return (
                          <div key={index} className={`col-${index}`}>
                            <div className="sku-info">
                              <div className="cover">
                                <img src={optimizePic(sku.coverPath)} />
                              </div>
                              <div className="info">
                                <div className="title">{sku.itemName ? limitWord(sku.itemName, 18) : '无'}</div>
                                <div className="desc">商品ID：{sku.itemId}</div>
                              </div>
                            </div>
                          </div>
                        )
                      } else {
                        const renderLimit =
                          type === PriceModalType.SPECIAL ? index < columns.length - 1 : index <= columns.length - 1
                        return renderLimit ? (
                          <div key={index} className={`col-${index}`}>
                            {column.render ? column.render(sku[key], sku, index) : sku[key]}
                          </div>
                        ) : null
                      }
                    })}
                    {type === PriceModalType.SPECIAL && (
                      <div className="col-expire">
                        <div>{lastColumn.render ? lastColumn.render(spu[lastKey], spu, spuIndex) : spu[lastKey]}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })
    )
  }

  render() {
    const { visible, title, width = 800, onCancel, currentRole, type } = this.props
    return (
      <Modal
        width={width}
        title={title}
        visible={visible}
        footer={null}
        onCancel={onCancel}
        maskClosable={false}
        destroyOnClose
      >
        <div className="spu-detail">
          <div className="company-info company-info--modal">
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
              <Form>{this.renderTableBody()}</Form>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default Form.create<P>()(PriceModal)
