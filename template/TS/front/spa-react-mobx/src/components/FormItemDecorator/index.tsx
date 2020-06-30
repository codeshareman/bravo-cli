import React, { Component } from "react";
import { Form, Input } from "antd";
import {
  FormComponentProps,
  GetFieldDecoratorOptions
} from "antd/lib/form/Form";
import { FormItemProps } from "antd/lib/form/FormItem";

import verify from "@/shared/common/verify";

//import "./index.scss";

export type ItemType = "Input" | "TextArea";

type P = FormComponentProps &
  FormItemProps & {
    children?: React.ReactNode;
    options?: GetFieldDecoratorOptions;
    field: string;
    itemType?: ItemType;
    validator?: any;
  };

type S = {};

const FormItemChildren = {
  Input: <Input />
};

const FormItem = Form.Item;
class FormItemDecorator extends Component<P, S> {
  render() {
    const {
      children,
      form,
      options = {},
      label,
      required = false,
      field,
      validator,
      itemType,
      ...rest
    } = this.props;
    const { getFieldDecorator } = form;
    const rules = options.rules || [];

    if (validator)
      if (typeof validator === "function") {
        rules.push({
          validator: validator
        });
      } else {
        rules.push({
          validator: (rule, value, cb) => verify(label, value, validator, cb)
        });
      }

    options.rules = rules;

    const ele = children
      ? children
      : itemType
      ? FormItemChildren[itemType]
      : null;

    return (
      <FormItem required={required} label={label} {...rest}>
        {getFieldDecorator(field, options)(ele)}
      </FormItem>
    );
  }
}

export default FormItemDecorator;
