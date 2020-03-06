import React, { FC, useMemo } from 'react'
import { Checkbox } from 'antd'
import NestTable from './children/NestTable'
import { CheckedStatus } from './children/NestTable/type'

import './index.scss'

type P = {
  checkable?: boolean //是否开始选择框
  checkedStatus?: CheckedStatus
  productList: Array<any>
  onChange?(productList)
  onCheckAll?(checked)
}

const NestOrderList: FC<P> = props => {
  const { checkable, onChange, productList, checkedStatus } = props

  useMemo(() => {
    productList
  }, [productList])

  const renderThead = () => {
    const columns = [
      {
        key: 'product',
        title: '商品',
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
          )
        },
      },
      {
        key: 'unitPrice',
        title: '价格',
        render: curVal => {
          const price = curVal.toFixed(2).toString()
          return '￥' + price.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        },
      },
      {
        key: 'discount',
        title: '采购价',
      },
      {
        key: 'shopNum',
        title: '数量',
      },
      {
        key: 'offer',
        //width: 150,
        title: '优惠',
      },
      {
        key: 'price',
        //width: 150,
        title: '金额',
        render: curVal => {
          const price = curVal.toFixed(2).toString()
          return '￥' + price.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        },
      },
    ]

    return columns.map((item, index) => {
      return (
        <div key={item.key} className={`col-${index + 1}`}>
          {item.title}
        </div>
      )
    })
  }

  return (
    <div className="nest-order-table">
      <div className="tb-header">
        {checkable ? (
          <div key={'check-all'} className={`col-0`}>
            <Checkbox
              checked={CheckedStatus.All === checkedStatus}
              indeterminate={CheckedStatus.INDETERMINATE === checkedStatus}
              onChange={props.onCheckAll}
            />
            <span className="label">全选</span>
          </div>
        ) : null}

        {renderThead()}
      </div>
      <div className="tb-body">
        {!productList || !productList.length ? null : (
          <NestTable checkable={checkable} dataSource={productList} onChange={onChange} />
        )}
      </div>
    </div>
  )
}

export default NestOrderList
