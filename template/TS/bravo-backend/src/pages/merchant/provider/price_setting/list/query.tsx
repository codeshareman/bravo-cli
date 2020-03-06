import * as React from 'react'
import { Form, Input, Button } from 'antd'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form'
import FormItemDecorator from '@/components/FormItemDecorator'
// import AuthCompo from '@/components/AuthCompo';

type P = FormComponentProps &
  RouteComponentProps & {
    merchantInfo: any
    onSubmit(values: any): any
  }
type S = {}

// 列表查询
@(withRouter as any)
class Query extends React.Component<P, S> {
  // 添加特殊价商品
  addSpecialProduct = () => {
    const { merchantInfo, history } = this.props
    history.push({
      pathname: `/business/provider/specialPrice/add/${merchantInfo.developerId}`,
    })
  }

  onSubmit = () => {
    setTimeout(() => {
      this.props.form.validateFields((err, values) => {
        this.props.onSubmit(values)
      })
    }, 100)
  }

  render() {
    const form = this.props.form

    return (
      <Form layout="inline" className="search-form">
        <div className="query-area">
          <div className="search-form-condition">
            {/* <FormItemDecorator
              label="是否有效"
              form={form}
              field="status"
              options={{
                initialValue: 1,
              }}
            >
              <Select style={{ width: 150 }} onChange={this.onSubmit}>
                <Option value={StrategyStatus.EFFECTIVE}>已生效</Option>
                <Option value={StrategyStatus.BEFORE_EFFECTIVE}>未生效</Option>
                <Option value={StrategyStatus.EXPIRED}>已失效</Option>
                <Option value={StrategyStatus.CANCELED}>已取消</Option>
              </Select>
            </FormItemDecorator> */}
            <FormItemDecorator label="商品ID" form={form} field="productId">
              <Input style={{ width: 220 }} placeholder="请输入商品ID" onPressEnter={this.onSubmit}></Input>
            </FormItemDecorator>
            {/* <FormItemDecorator label="有效期" form={form} field="validDate">
              <RangePicker format="YYYY/MM/DD" placeholder={['开始时间', '截止时间']} />
            </FormItemDecorator> */}
          </div>
          <div className="search-form-btn">
            {/* <AuthCompo scope="approval_special_price:search"> */}
            <Button type="primary" style={{ marginRight: 10 }} onClick={this.onSubmit}>
              查询
            </Button>
            {/* </AuthCompo> */}
          </div>
          <div className="action-btn">
            <Button icon="plus" onClick={this.addSpecialProduct}>
              新增特殊价
            </Button>
          </div>
        </div>
      </Form>
    )
  }
}

export default Form.create<P>()(Query)
