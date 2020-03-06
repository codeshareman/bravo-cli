import React, { Component } from 'react'
import { Input, Button } from 'antd'
import Form, { FormComponentProps } from 'antd/lib/form'
import FormItemDecorator from '@/components/FormItemDecorator'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import './style.scss'
// import AuthCompo from '@/components/AuthCompo';

interface QueryProps extends FormComponentProps, Partial<RouteComponentProps> {
  getData: (values: any) => any
}

@(withRouter as any)
class Query extends Component<QueryProps> {
  onSubmit = () => {
    const { getData } = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        const params = { ...values }
        params.page = 1
        getData(params)
      }
    })
  }
  onReset = () => {
    this.props.form.resetFields()
  }
  render() {
    const { form } = this.props
    return (
      <div>
        <Form className="query-area" layout="inline" colon={false}>
          <div className="search-field">
            <div>
              <FormItemDecorator
                form={form}
                field="opsActivityId"
                label="活动ID"
                labelCol={{ style: { width: 50, textAlign: 'left' } }}
              >
                <Input style={{ width: 200 }} placeholder="请输入活动ID" />
              </FormItemDecorator>
              <FormItemDecorator
                form={form}
                field="activityName"
                label="活动名称"
                labelCol={{ style: { width: 60, textAlign: 'left' } }}
              >
                <Input style={{ width: 200 }} placeholder="请输入活动名称" />
              </FormItemDecorator>
              <FormItemDecorator
                form={form}
                field="uid"
                label="商户UID"
                labelCol={{ style: { width: 60, textAlign: 'left' } }}
              >
                <Input style={{ width: 200 }} placeholder="请输入商户UID" />
              </FormItemDecorator>
            </div>
          </div>
          <div className="search-btn">
            {/* <AuthCompo scope={'award:search'}> */}
            <Button type="primary" style={{ marginRight: 10 }} onClick={() => this.onSubmit()}>
              查询
            </Button>
            {/* </AuthCompo> */}
            <Button className="btn-reset" style={{ marginRight: 10 }} onClick={this.onReset}>
              重置
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default Form.create<QueryProps>()(Query)
