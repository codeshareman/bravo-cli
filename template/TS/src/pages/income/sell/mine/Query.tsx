import React, { Component } from "react";
import { Form, Button, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItemDecorator from "@/components/FormItemDecorator";
import { FilterParams } from "@/types/agent";

type P = FormComponentProps & {
  filter: FilterParams;
  onSubmit?(value: any);
};
type S = {};

class Query extends Component<P, S> {
  
  componentWillReceiveProps(nextProps) {
    const preFilter = this.props.filter;
    const nextFilter = nextProps.filter;

    //如果父级条件有变化则重置表单内容
    if (
      preFilter.businessType !== nextFilter.businessType ||
      preFilter.params.month !== nextFilter.params.month ||
      preFilter.params.year !== nextFilter.params.year
    ) {
      const { form } = nextProps;
      form.resetFields();
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    const values = form.getFieldsValue();
    onSubmit && onSubmit(values);
  };

  render() {
    const { form } = this.props;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItemDecorator form={form} label="图书馆" filed="queryString">
          <Input placeholder="请输入图书馆ID或名称" />
        </FormItemDecorator>
        <Form.Item>
          <Button icon="search" htmlType="submit" type="primary">
            查询
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<P>()(Query);
