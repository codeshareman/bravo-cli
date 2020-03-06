import React, { Component } from 'react'
import { Form, Input, Select, DatePicker, Button } from 'antd'
import FormItemDecorator from '@/components/FormItemDecorator'
import { FormComponentProps } from 'antd/lib/form'
import { ApprovalStatus } from '@xmly/cbp-spec/lib/portal/service/oss/AccountService'
// import AuthCompo from '@/components/AuthCompo';

type P = FormComponentProps & {
  onSubmit?(values: any)
}
type S = {
  visible: boolean
  pageIndex: number
  pageSize: number
}

const RangePicker = DatePicker.RangePicker
const Option = Select.Option

class Query extends Component<P, S> {
  state: S = {
    visible: false,
    pageIndex: 1,
    pageSize: 10,
  }

  onSubmit = (type = '') => {
    const { setFieldsValue } = this.props.form
    if (type === 'picker') {
      setFieldsValue({ approvalTime: undefined })
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
      agencyArea: '',
      status: ApprovalStatus.WAITING_APPROVAL,
      createAtRangeStart: null,
      createAtRangeEnd: null,
      pageIndex: 1,
      pageSize: 10,
    })
  }

  renderApprovalStatusOpts = () => {
    const data = [
      {
        id: ApprovalStatus.WAITING_APPROVAL,
        name: '待审批',
      },
      {
        id: ApprovalStatus.ACCEPTED,
        name: '已通过',
      },
      {
        id: ApprovalStatus.REJECTED,
        name: '未通过',
      },
    ]
    return data.map(item => {
      return (
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      )
    })
  }

  render() {
    const { form } = this.props
    return (
      <Form className="approval-search" layout="inline">
        <div className="search-form--fields">
          <div>
            <FormItemDecorator form={form} field="companyName" label="公司名称">
              <Input style={{ width: 200 }} placeholder="请输入公司名称" onPressEnter={() => this.onSubmit()} />
            </FormItemDecorator>
            {/* <FormItemDecorator
              form={form}
              field="agencyArea"
              label="代理地区"
              options={{ initialValue: [] }}
            >
              <CustAreaSelect type={selectAreaType.SINGLE} form={form} onSubmit={this.onSubmit} />
            </FormItemDecorator> */}
            <FormItemDecorator
              form={form}
              field="status"
              label="审批状态"
              options={{ initialValue: ApprovalStatus.WAITING_APPROVAL }}
            >
              <Select placeholder="请选择审批状态" style={{ width: 200 }} onChange={this.onSubmit}>
                {this.renderApprovalStatusOpts()}
              </Select>
            </FormItemDecorator>
          </div>
          <div>
            <FormItemDecorator form={form} field="approvalTime" label="申请时间">
              <RangePicker style={{ width: 200 }} onChange={() => this.onSubmit('picker')} allowClear />
            </FormItemDecorator>
          </div>
        </div>
        <div className="search-form--btn">
          {/* <AuthCompo scope="approval_settle:search"> */}
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => this.onSubmit()}>
            查询
          </Button>
          {/* </AuthCompo> */}
          <Button className="btn-reset" onClick={this.onReset}>
            重置
          </Button>
        </div>
      </Form>
    )
  }
}

export default Form.create<P>()(Query)
