import * as React from 'react'
import { Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

import './index.scss'

type P = FormComponentProps & {
  onChange?(e: any): void
  field: string
}
type S = {}

// 价格区间
class RangePrice extends React.Component<P, S> {
  setStartPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startPrice = e.target.value
    this.props.onChange({
      startPrice,
      endPrice: this.props.form.getFieldValue('field').endPrice,
    })
  }

  setEndPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endPrice = e.target.value
    this.props.onChange({
      startPrice: this.props.form.getFieldValue('field').startPrice,
      endPrice,
    })
  }

  render() {
    return (
      <div>
        <Input style={{ width: 120 }} placeholder="起始价格" onChange={this.setStartPrice} />
        <span className="split-line">~</span>
        <Input style={{ width: 120 }} placeholder="结束价格" onChange={this.setEndPrice}></Input>
      </div>
    )
  }
}

export default RangePrice
