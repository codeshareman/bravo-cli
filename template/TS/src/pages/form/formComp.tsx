import React, { Component } from "react";
import { Form, Button, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { CustInput } from "../../components/CustComponents";
import CustTextArea from "../../components/CustComponents/CustTextArea";
import FormItemDecorator from "../../components/FormItemDecorator";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { MainContent } from "../../layout";
import "./index.scss";

type P = RouteComponentProps & FormComponentProps & {};
type S = {};

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
    md: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 12 }
  }
};

class FormComp extends Component<P, S> {
  handleSubmit = e => {
    e.preventDefault();
    console.log(this);
    const { validateFields } = this.props.form;

    validateFields((err, values) => {
      console.log({ err, values });
      if (!err) {
        console.log("保存中....");
      }
    });
  };

  render() {
    const { form } = this.props;
    return (
      <MainContent>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <FormItemDecorator
            required
            form={form}
            label="姓名"
            field="name"
            validator="required"
            options={{
              initialValue: ""
            }}
          >
            <CustInput limit={30} />
          </FormItemDecorator>

          <FormItemDecorator
            required
            form={form}
            label="邮箱"
            field="email"
            //itemType= "Input"
            validator="required|email"
            options={{
              initialValue: ""
            }}
          >
            <Input />
          </FormItemDecorator>

          <FormItemDecorator
            required
            form={form}
            label="身份证号码"
            field="idCard"
            //itemType= "Input"
            validator="required|idCard"
            options={{
              initialValue: ""
            }}
          >
            <Input />
          </FormItemDecorator>
          <FormItemDecorator
            required
            form={form}
            label="手机号"
            field="mobile"
            validator="required|mobile"
            options={{
              initialValue: ""
            }}
          >
            <Input />
          </FormItemDecorator>
          <FormItemDecorator
            required
            form={form}
            label="描述"
            field="desc2"
            options={{
              initialValue: "我是描述"
            }}
          >
            <CustTextArea limit={300} />
          </FormItemDecorator>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 20 }}
            >
              保存
            </Button>
            <Button
              type="default"
              onClick={() => {
                this.props.history.goBack();
              }}
            >
              退出
            </Button>
          </FormItem>
        </Form>
      </MainContent>
    );
  }
}

export default Form.create()(withRouter(FormComp));
