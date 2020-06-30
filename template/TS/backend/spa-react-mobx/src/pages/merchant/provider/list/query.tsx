import React, { Component } from 'react'
import { Form, Input, DatePicker, Button } from 'antd'
import FormItemDecorator from '@/components/FormItemDecorator'
import { FormComponentProps } from 'antd/lib/form'
import CustRoleSelect from '@/components/CustComponents/CustRoleSelect'
// import AuthCompo from '@/components/AuthCompo';

const { RangePicker } = DatePicker

type P = FormComponentProps & {
  onSubmit?(values): any
}
type S = {}

// 查询
class Query extends Component<P, S> {
  onSubmit = (type = '') => {
    const { setFieldsValue } = this.props.form
    if (type === 'picker') {
      setFieldsValue({ createTime: [] })
    }
    setTimeout(() => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.onSubmit(values)
        }
      })
    }, 100)
  }

  onReset = () => {
    this.props.form.resetFields()
    this.props.onSubmit({
      companyName: '',
      agentDistrict: '',
      developerId: null,
      contractNo: '',
      startTs: null,
      endTs: null,
      role: null,
      pageNum: 1,
      pageSize: 10,
    })
  }

  render() {
    const { form } = this.props
    return (
      <Form className="provider-query" layout="inline">
        <div className="search-field">
          <div>
            <FormItemDecorator
              form={form}
              field="companyName"
              label="公司名称"
              labelCol={{ style: { width: 60, textAlign: 'left' } }}
            >
              <Input style={{ width: 200 }} placeholder="请输入公司名称" onPressEnter={() => this.onSubmit()} />
            </FormItemDecorator>
            {/* <FormItemDecorator
              style={{ width: 260, marginRight: 14 }}
              form={form}
              field="agencyArea"
              label="代理地区"
              labelCol={{ style: { width: 60, textAlign: 'left' } }}
              options={{ initialValue: [] }}
            >
              <CustAreaSelect
                type={selectAreaType.SINGLE}
                form={form}
                onSubmit={() => this.onSubmit()}
              />
            </FormItemDecorator> */}
            <FormItemDecorator
              form={form}
              field="developerId"
              label="开发者ID"
              labelCol={{ style: { width: 60, textAlign: 'left', marginRight: 2 } }}
            >
              <Input style={{ width: 200 }} placeholder="请输入开发者ID" onPressEnter={() => this.onSubmit()} />
            </FormItemDecorator>
            <FormItemDecorator
              form={form}
              field="contractNo"
              label="合同编号"
              labelCol={{ style: { width: 60, textAlign: 'left' } }}
            >
              <Input style={{ width: 200 }} placeholder="请输入合同编号" onPressEnter={() => this.onSubmit()} />
            </FormItemDecorator>
          </div>
          <div>
            <FormItemDecorator
              form={this.props.form}
              field={'role'}
              label="角色"
              labelCol={{ style: { width: 60, textAlign: 'right' } }}
            >
              <CustRoleSelect style={{ width: 200 }} placeholder="请选择角色" onSubmit={this.onSubmit} allowClear />
            </FormItemDecorator>
            <FormItemDecorator className={'creatTime'} form={this.props.form} field={'createTime'} label="创建时间">
              <RangePicker style={{ width: 200 }} onChange={() => this.onSubmit('picker')} allowClear />
            </FormItemDecorator>
          </div>
        </div>
        <div className="search-btn">
          {/* <AuthCompo scope="account:search"> */}
          <Button type="primary" style={{ marginRight: 10 }}>
            查询
          </Button>
          {/* </AuthCompo> */}
          <Button className="btn-reset" style={{ marginRight: 10 }} onClick={this.onReset}>
            重置
          </Button>
        </div>
      </Form>
    )
  }
}

export default Form.create<P>()(Query)
