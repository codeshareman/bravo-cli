import React, { Component } from 'react'
import { Form, Input, Select, DatePicker, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import FormItemDecorator from '@/components/FormItemDecorator'
import { OrderState } from '@xmly/cbp-spec/lib/portal/service/provider/OrderService'
// import AuthCompo from '@/components/AuthCompo';

type P = FormComponentProps & {
  onSubmit(values)
  companyNameList: any[]
}
type S = {}

const { Option } = Select
const { RangePicker } = DatePicker

class Query extends Component<P, S> {
  onSubmit = () => {
    const { onSubmit } = this.props
    setTimeout(() => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            ...values,
            pageNum: 1,
            pageSize: 10,
          }
          onSubmit && onSubmit(params)
        }
      })
    })
  }

  onReset = () => {
    const { onSubmit } = this.props
    this.props.form.resetFields()
    const params = {
      state: OrderState.WAIT_DELIVER,
      startTs: null,
      endTs: null,
      orderNo: '',
      pageNum: 1,
      pageSize: 10,
    }
    onSubmit && onSubmit(params)
  }

  render() {
    const { form } = this.props
    const labelCol = {
      style: { width: 60 },
    }
    const { companyNameList } = this.props
    return (
      <Form className="real-order-search-form" layout="inline" labelAlign="left">
        <div className="search-form-condition">
          <div>
            <FormItemDecorator
              field="state"
              label="订单状态"
              form={form}
              labelCol={labelCol}
              options={{ initialValue: OrderState.WAIT_DELIVER }}
            >
              <Select style={{ width: 200 }} onChange={this.onSubmit}>
                <Option value={OrderState.WAIT_DELIVER}>待发货</Option>
                <Option value={OrderState.WAIT_RECEIVE}>待收货</Option>
                <Option value={OrderState.COMPLETE}>已完成</Option>
              </Select>
            </FormItemDecorator>
            <FormItemDecorator
              field="date"
              label="订单生成时间"
              labelCol={{
                style: { width: 85 },
              }}
              form={form}
            >
              <RangePicker format="YYYY/MM/DD" onChange={this.onSubmit} />
            </FormItemDecorator>
            {/* <FormItemDecorator
              form={form}
              field="agencyArea"
              label="代理地区"
              labelCol={labelCol}
              options={{ initialValue: [] }}
            >
              <CustAreaSelect type={selectAreaType.SINGLE} form={form} onSubmit={this.onSubmit} />
            </FormItemDecorator> */}
            {/* 所属业务展示不选取 */}
            {/* <FormItemDecorator
              form={form}
              field="businessType"
              label="所属业务"
              labelCol={labelCol}
              options={{ initialValue: [] }}
            >
              <Select
                allowClear
                style={{width: 200}}
                placeholder="请选择所属业务"
              >
                {BUSSINESS_TYPE_LIST.map(e=>{
                  return(
                    <Select.Option value={BUSINESS_TYPE_DICT[e].value}>{BUSINESS_TYPE_DICT[e].label}</Select.Option>
                  )
                })}
              </Select>
            </FormItemDecorator> */}
            <FormItemDecorator
              form={form}
              field="supplierIdList"
              label="供应商"
              labelCol={{ style: { width: 50 } }}
              options={{ initialValue: [] }}
            >
              <Select
                allowClear
                style={{ width: 200 }}
                placeholder="请选择供应商"
                mode="multiple"
                filterOption={(input, option) => {
                  return (option.props.children as string).indexOf(input) !== -1 ? true : false
                }}
              >
                {companyNameList.map(e => {
                  return (
                    <Select.Option key={e.developerId} value={e.developerId}>
                      {e.companyName}
                    </Select.Option>
                  )
                })}
              </Select>
            </FormItemDecorator>
          </div>
          <div>
            <FormItemDecorator field="companyName" label="公司名称" form={form} labelCol={labelCol}>
              <Input style={{ width: 200 }} placeholder="请输入公司或企业名称" onPressEnter={this.onSubmit} />
            </FormItemDecorator>
            <FormItemDecorator
              field="orderNo"
              label="订单编号"
              form={form}
              labelCol={{
                style: { width: 85 },
              }}
            >
              <Input style={{ width: 290 }} placeholder="请输入订单编号" onPressEnter={this.onSubmit} />
            </FormItemDecorator>
          </div>
        </div>
        <div className="search-form-btn">
          {/* <AuthCompo scope="order:search"> */}
          <Button type="primary" style={{ marginRight: 10 }} onClick={this.onSubmit}>
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
