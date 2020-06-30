import React, { Component } from "react";
import { Form, Select, Input, Button } from "antd";
import { AddressCascader, AddressSelector } from "@/components/CustComponents";
import { FormComponentProps } from "antd/lib/form";
import FormItemDecorator from "@/components/FormItemDecorator";
import { UserContactViewDto } from "@/api/service/ContactService";

type P = FormComponentProps & {
  item?: UserContactViewDto;
  children?: React.ReactNode;
  onSubmit(values);
};
type S = {};

const { TextArea } = Input;
class EditAddress extends Component<P, S> {
  handleSubmit = e => {
    e.preventDefault();
    const { form, onSubmit, item } = this.props;
    form.validateFields((errs, values) => {
      console.log({ errs, values });
      if (!errs) {
        //提交
        if (item && item.usrContactId) {
          values.usrContactId = item.usrContactId;
        }
        console.log({values}, "-----")
        onSubmit && onSubmit(values);
      }
    });
  };

  render() {
    const { form, item } = this.props;
    console.log({ item });
    let addressNames = "";
    if (item && item.province && item.city && item.area) {
      addressNames = item.province + "/" + item.city + "/" + item.area;
    }

    return (
      <Form className="edit-form" onSubmit={this.handleSubmit}>
        <FormItemDecorator
          field="areaCode"
          label="所在地区"
          form={form}
          required={item && item.usrContactId ? false : true}
          validator={item && item.usrContactId ? "" : "required"}
        >
          <AddressSelector value4Show={addressNames} />
        </FormItemDecorator>
        <FormItemDecorator
          field="addressLine"
          label="详细地址"
          form={form}
          required
          validator="required"
          options={{
            initialValue: item ? item.addressLine : ""
          }}
        >
          <TextArea rows={4} />
        </FormItemDecorator>
        <FormItemDecorator
          field="contactName"
          label="收货人"
          form={form}
          required
          validator="required"
          options={{
            initialValue: item ? item.contactName : ""
          }}
        >
          <Input placeholder="请输入收货人姓名" />
        </FormItemDecorator>
        <FormItemDecorator
          field="contactPhone"
          label="手机号"
          form={form}
          required
          validator="required|mobile"
          options={{
            initialValue: item ? item.contactPhone : ""
          }}
        >
          <Input placeholder="请输入收货人姓名" />
        </FormItemDecorator>
        {/* <FormItemDecorator
          field="phone1"
          label="备用手机号"
          form={form}
          validator="mobile"
          options={{
            initialValue: item ? item. : ""
          }}
        >
          <Input placeholder="选填" />
        </FormItemDecorator> */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<P>()(EditAddress);
