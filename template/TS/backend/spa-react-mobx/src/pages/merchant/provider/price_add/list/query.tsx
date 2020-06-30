import * as React from 'react'
import { Form, Input, Button } from 'antd'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form'
import FormItemDecorator from '@/components/FormItemDecorator'

type P = FormComponentProps &
  RouteComponentProps & {
    onSubmit(values: any): any
  }
type S = {
  visible: boolean
  productId: string | number
}

// 列表查询
class Query extends React.Component<P, S> {
  readonly state: S = {
    visible: false,
    productId: '',
  }

  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      this.props.onSubmit(values)
    })
  }

  // 批量设置特殊价
  batchSetSpecialPrice = () => {
    this.setState({
      visible: true,
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  handleConfirm = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const form = this.props.form

    return (
      <div>
        <Form layout="inline" className="search-form">
          <div className="query-area">
            <div className="search-form-condition">
              <FormItemDecorator label="商品ID" form={form} field="productId">
                <Input style={{ width: 220 }} placeholder="请输入商品ID" onPressEnter={this.onSubmit}></Input>
              </FormItemDecorator>
              {/* <FormItemDecorator label="原价" form={form} field="validDate">
                <RangePrice />
              </FormItemDecorator> */}
            </div>
            <div className="search-form-btn">
              <Button style={{ marginRight: 10 }} type="primary" onClick={this.onSubmit}>
                查询
              </Button>
              {/* <Button icon="add" onClick={this.batchSetSpecialPrice}>
                批量设置特殊价
              </Button> */}
            </div>
          </div>
        </Form>
        {/* <PriceSetModal
          title="批量设置特殊价"
          productId={this.state.productId}
          visible={this.state.visible}
          onOk={this.handleConfirm}
          onCancel={this.handleCancel}
          destroyOnClose
        /> */}
      </div>
    )
  }
}

export default withRouter(Form.create<P>()(Query))
