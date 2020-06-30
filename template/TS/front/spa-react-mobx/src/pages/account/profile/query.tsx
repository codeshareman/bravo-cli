import React, { Component } from "react";
import { Form, Input, DatePicker, Select, Button, Icon } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItemDecorator from "@/components/FormItemDecorator";
import { TradeTypeText } from "@/shared/common/constants";
import { TradeType } from "@/api/service/AccountService";

type P = FormComponentProps & {
  onSubmit(values);
};

const { RangePicker } = DatePicker;

class Query extends Component<P> {
  handleSubmit = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    const values = form.getFieldsValue();
    Object.keys(values).forEach(key => {
      if (!values[key]) {
        delete values[key];
      } else if (values.tradeTime && values.tradeTime.length) {
        values.tradeTimeStart = values.tradeTime[0].valueOf();
        values.tradeTimeEnd = values.tradeTime[1].valueOf();
        delete values.tradeTime;
      }
    });

    console.log({ values });
    onSubmit && onSubmit(values)
  };

  render() {
    const { form } = this.props;
    return (
      <Form className="query-form" layout="inline" onSubmit={this.handleSubmit}>
        <FormItemDecorator form={form} field="tradeTime" label="交易时间">
          <RangePicker />
        </FormItemDecorator>
        <FormItemDecorator
          form={form}
          field="tradeType"
          label="交易类型"
          options={{
            initialValue: ""
          }}
        >
          <Select style={{ width: 150 }}>
            <Select.Option value="">全部</Select.Option>
            <Select.Option value={TradeType.WITHDRAW}>
              {TradeTypeText[TradeType.WITHDRAW]}
            </Select.Option>
            <Select.Option value={TradeType.COMMISSION}>
              {TradeTypeText[TradeType.COMMISSION]}
            </Select.Option>
            <Select.Option value={TradeType.DEDUCT}>
              {TradeTypeText[TradeType.DEDUCT]}
            </Select.Option>
            <Select.Option value={TradeType.RECHARGE}>
              {TradeTypeText[TradeType.RECHARGE]}
            </Select.Option>
            <Select.Option value={TradeType.TRANSER_IN}>
              {TradeTypeText[TradeType.TRANSER_IN]}
            </Select.Option>
            <Select.Option value={TradeType.TRANSER_OUT}>
              {TradeTypeText[TradeType.TRANSER_OUT]}
            </Select.Option>
            <Select.Option value={TradeType.WITHDRAW_FEE}>
              {TradeTypeText[TradeType.WITHDRAW_FEE]}
            </Select.Option>
          </Select>
        </FormItemDecorator>
        <FormItemDecorator form={form} field="trxNo" label="交易流水号">
          <Input placeholder="请输入交易流水号" />
        </FormItemDecorator>
        <Form.Item>
          <Button
            style={{ margin: "0 10px 0 20px" }}
            type="primary"
            htmlType="submit"
          >
            查询
          </Button>
          <a className="download">
            <Icon type="download" />
          </a>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<P>()(Query);
