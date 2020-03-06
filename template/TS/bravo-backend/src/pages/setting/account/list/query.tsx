import * as React from 'react'
import { Form, Input, Button } from 'antd'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form'
import FormItemDecorator from '@/components/FormItemDecorator'
import CustRoleSelect from '@/components/CustComponents/CustRoleSelect'

type P = FormComponentProps & RouteComponentProps & {}
type S = {}

// 列表查询
@(withRouter as any)
class Query extends React.Component<P, S> {
  // 添加特殊价商品
  addSpecialProduct = () => {
    this.props.history.push('/business/provider/specialPrice/add')
  }

  render() {
    const form = this.props.form

    return (
      <Form layout="inline" className="search-form">
        <div className="query-area">
          <div className="search-form-condition">
            <FormItemDecorator label="真实姓名" form={form} field="shopNumOrName">
              <Input style={{ width: 220 }} placeholder="请输入用户真实姓名"></Input>
            </FormItemDecorator>
            <FormItemDecorator label="角色" form={form} field="validDate">
              <CustRoleSelect style={{ width: 200 }} placeholder="请选择角色" allowClear />
            </FormItemDecorator>
          </div>
          <div className="search-form-btn">
            <Button type="primary" style={{ marginRight: 10 }}>
              查询
            </Button>
            <Button className="btn-reset">重置</Button>
          </div>
        </div>
      </Form>
    )
  }
}

export default Form.create()(Query)
