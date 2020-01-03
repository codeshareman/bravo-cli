import React, { Component } from "react";
import { Form, Input, Button } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItemDecorator from "@/components/FormItemDecorator";

type P = FormComponentProps & {
  onSubmit(values);
};
type S = {};

class Query extends Component<P, S> {
  handleSubmit = e => {
    e.preventDefault();
    const { onSubmit, form } = this.props;
    onSubmit && onSubmit(form.getFieldsValue());
  };

  render() {
    const { form } = this.props;
    return (
      <Form className="query-form" layout="inline" onSubmit={this.handleSubmit}>
        <FormItemDecorator label="" form={form} field="queryString">
          <Input
            allowClear
            placeholder="请输入商品名称或商品ID"
            style={{ width: 300 }}
          />
        </FormItemDecorator>
        <Form.Item>
          <Button icon="search" type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<P>()(Query);
