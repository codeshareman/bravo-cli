import React, { Component } from 'react'
import { Input, DatePicker, Button } from 'antd'
import Form, { FormComponentProps } from 'antd/lib/form'
import FormItemDecorator from '@/components/FormItemDecorator'
import { getTimestamp } from '@/shared/common/utils'
import './style.scss'
// import AuthCompo from '@/components/AuthCompo';

interface QueryProps extends FormComponentProps {
  getData: (values: any) => any
}

class Query extends Component<QueryProps> {
  onSubmit = () => {
    const { getData } = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = { ...values }
        params.startOpenDate = params.dateList && params.dateList.length > 0 ? getTimestamp(params.dateList[0]) : null
        params.endOpenDate = params.dateList && params.dateList.length > 0 ? getTimestamp(params.dateList[1]) : null
        params.page = 1
        const middleData = {
          companyName: values.companyName,
          developId: values.developId,
          uid: values.uid,
        }
        params.baseAccount = { ...middleData }
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
                field="companyName"
                label="公司名称"
                labelCol={{ style: { width: 60, textAlign: 'left' } }}
              >
                <Input style={{ width: 200 }} placeholder="请输入公司名称" />
              </FormItemDecorator>
              <FormItemDecorator
                form={form}
                field="uid"
                label="商户UID"
                labelCol={{ style: { width: 60, textAlign: 'left' } }}
              >
                <Input style={{ width: 200 }} placeholder="请输入商户UID" />
              </FormItemDecorator>
              <FormItemDecorator
                form={form}
                field="dateList"
                label="奖励开通时间"
                labelCol={{ style: { width: 80, textAlign: 'left' } }}
              >
                <DatePicker.RangePicker style={{ width: 200 }} allowClear />
              </FormItemDecorator>
              {/* <FormItemDecorator
                            form={form}
                            field="accountStatus"
                            label="账户状态"
                            labelCol={{ style: { width: 60, textAlign: 'left' } }}
                        >
                            <Select
                                style={{ width: 250 }}
                                placeholder="请选择服务商状态"
                                allowClear
                            >
                                {ACCOUNT_STATUS.map(e=>{
                                    return(
                                        <Select.Option key={e.value} value={e.value}>{e.label}</Select.Option>
                                    )
                                })}
                            </Select>
                        </FormItemDecorator> */}
            </div>
            <div>
              <FormItemDecorator
                form={form}
                field="ddApprovalNo"
                label="审批编号"
                labelCol={{ style: { width: 60, textAlign: 'left' } }}
              >
                <Input style={{ width: 200 }} placeholder="请输入奖励开通审批编号" />
              </FormItemDecorator>
            </div>
          </div>
          <div className="search-btn">
            {/* <AuthCompo scope={'award:search_account_list'}> */}
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
