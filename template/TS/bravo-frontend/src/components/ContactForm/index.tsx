import React, { FC } from "react";
import { Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItemDecorator from "@/components/FormItemDecorator";
import { CodeInput } from "@/components/CustComponents";
import { CodeType } from "@/components/CustComponents/CodeInput";

import "./index.scss";

export type ContactEntity = {
  contactName: String;
  // 手机号
  contactMobile: String;
  // 邮箱
  contactEmail: String;
};

type P = FormComponentProps & {
  contactEntity?: ContactEntity;
};

const ContactForm: FC<P> = props => {
  const { form, contactEntity } = props;

  const mobile =
    form.getFieldValue("contactMobile") || contactEntity.contactMobile || "";
  const email =
    form.getFieldValue("contactEmail") || contactEntity.contactEmail || "";

  return (
    <div className="contact-from">
      <div className="form-item-title">联系人信息</div>
      <FormItemDecorator
        required
        form={form}
        label="联系人姓名"
        field="contactName"
        validator="required|max:40"
        options={{
          initialValue: contactEntity && contactEntity.contactName
        }}
      >
        <Input placeholder="请输入联系人姓名" />
      </FormItemDecorator>
      <FormItemDecorator
        required
        form={form}
        label="手机号"
        field="contactMobile"
        validator="required|mobile"
        options={{
          initialValue: contactEntity && contactEntity.contactMobile
        }}
      >
        <Input placeholder="请输入手机号" />
      </FormItemDecorator>
      <FormItemDecorator
        required
        form={form}
        label="手机验证码"
        field="contactMobileVerifyCode"
        validator="required|max:40"
      >
        <CodeInput
          dist={mobile}
          placeholder="请输入手机验证码"
          suffixtext="获取手机验证码"
          codetype={CodeType.MOBILE}
        />
      </FormItemDecorator>
      <FormItemDecorator
        required
        form={form}
        label="邮箱"
        field="contactEmail"
        validator="required|email"
        options={{
          initialValue: contactEntity && contactEntity.contactEmail
        }}
      >
        <Input placeholder="请输入邮箱" />
      </FormItemDecorator>
      <FormItemDecorator
        required
        form={form}
        label="邮箱验证码"
        field="contactEmailVerifyCode"
        extra="发送邮箱验证码后,请登录邮箱获取验证码!"
        validator="required|max:6"
      >
        <CodeInput
          dist={email}
          placeholder="请输入邮箱验证码"
          suffixtext="获取邮箱验证码"
          codetype={CodeType.EMAIL}
        />
      </FormItemDecorator>
    </div>
  );
};

export default ContactForm;
