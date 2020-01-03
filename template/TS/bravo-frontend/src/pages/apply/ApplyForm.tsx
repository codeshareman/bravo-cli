import React, { Component } from "react";
import { Form, Input, Divider, Button, Checkbox, message, Modal } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItemDecorator from "@/components/FormItemDecorator";
import InputWarpperUpload from "@/components/InputWarpperUpload";
import ContactForm from "@/components/ContactForm";
import { UploadType } from "@/components/CustComponents/ClampUpload";
import { AddressCascader, CitySelector } from "@/components/CustComponents";
import { CitySelectorType } from "@/components/CustComponents/CitySelector/type";
import { AccountApplyRequest } from "@/api/service/AccountService";
import { ContactEntity } from "@/components/ContactForm";
import { IDistrict } from "@/api/service/DistrictService";
import Api from "@/api";
import { VerifyCompanyNameRequest } from "@/api/service/AccountService";
import { HTTP_STATUS } from "@/shared/common/constants";

type P = FormComponentProps & {
  agreement: boolean;
  onSubmit(values);
  onGoBack();
  onAgreement();
  onAgreementChange(agreement?: boolean);
  entity: AccountApplyRequest;
  companyNameDisabled?: boolean;
};
type S = {
  tipsVisible: boolean;
  contactEntity: ContactEntity;
  addressOptions: IDistrict[];
};

let timer = null;
class ApplyForm extends Component<P, S> {
  state = {
    tipsVisible: false,
    contactEntity: null,
    addressOptions: []
  };

  toggleTipsVisible = () => {
    const { tipsVisible } = this.state;
    this.setState({
      tipsVisible: !tipsVisible
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { agreement } = this.props;
    if (!agreement) {
      message.warning("请先勾选喜马拉雅开方平台开发者协议");
      return false;
    }
    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        this.toggleTipsVisible();
      }
    });
  };

  onSubmit = () => {
    const { form, onSubmit, entity } = this.props;
    const { getFieldValue, getFieldsValue } = form;
    const values = getFieldsValue();
    const { addressOptions } = this.state;
    const companyAddr = getFieldValue("companyAddr");
    const address = addressOptions.map(item => item.label).join("/");
    values.companyAddr = address + "-" + companyAddr;
    if (entity && entity.developerId) {
      values.developerId = entity.developerId;
    }
    onSubmit && onSubmit(values);
  };

  addressChange = (value, options) => {
    this.setState({
      addressOptions: options
    });
  };

  companyNameChange = (rule, value, callback) => {
    if (!value) {
      return false;
    }
    !!timer && clearTimeout(timer);
    timer = setTimeout(() => {
      this.verifyCompanyName(value, callback);
    }, 500);
  };

  verifyCompanyName = (companyName, callback) => {
    const { entity } = this.props;
    let params: VerifyCompanyNameRequest = {
      companyName: companyName
    };
    if (entity && entity.developerId) {
      params.developerId = +entity.developerId;
    }
    Api.account
      .verifyCompanyName(params)
      .then(r => {
        console.log({ r });
        if (HTTP_STATUS.SUCCESSS === r.code && r.data) {
          //验证不通过
          callback("该公司名称已注册,请换一个在试。");
        } else {
          callback();
        }
      })
      .catch(e => {
        callback();
      });
  };

  agreementChange = e => {
    const { checked } = e.target;
    this.props.onAgreementChange(checked);
  };

  render() {
    const { form, entity, companyNameDisabled, agreement } = this.props;
    const { tipsVisible } = this.state;
    let companyArea = [];
    if (entity && entity.companyArea) {
      companyArea = entity.companyArea.split(",");
    }
    const contactEntity = {
      contactName: entity && entity.contactName,
      // 手机号
      contactMobile: entity && entity.contactMobile,
      // 邮箱
      contactEmail: entity && entity.contactEmail
    };
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <div className="form-item-title">公司信息</div>
          <FormItemDecorator
            required
            form={form}
            label="公司名称"
            field="companyName"
            validator="required|max:10"
            options={{
              initialValue: entity && entity.companyName,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    this.companyNameChange(rule, value, callback);
                  }
                }
              ]
            }}
          >
            <Input
              placeholder="请输入公司名称"
              disabled={companyNameDisabled}
              //onChange={this.companyNameChange}
            />
          </FormItemDecorator>
          <FormItemDecorator
            required
            form={form}
            label="公司官网"
            field="companyHomePage"
            validator="required|looseUrl"
            options={{
              initialValue: entity && entity.companyHomePage
            }}
          >
            <Input placeholder="请输入公司官网" />
          </FormItemDecorator>
          <FormItemDecorator
            required
            form={form}
            label="公司介绍"
            field="companyIntro"
            validator="required|max:300"
            options={{
              initialValue: entity && entity.companyIntro
            }}
          >
            <Input.TextArea rows={4} placeholder="请描述公司主营业务" />
          </FormItemDecorator>
          <FormItemDecorator
            required
            form={form}
            label="公司地址"
            field="companyArea"
            validator="required"
            options={{
              initialValue: companyArea
            }}
          >
            <AddressCascader onChange={this.addressChange} />
          </FormItemDecorator>
          <FormItemDecorator
            required
            form={form}
            label="详细地址"
            field="companyAddr"
            validator="required|max:200"
            options={{
              initialValue: entity && entity.companyAddr
            }}
          >
            <Input.TextArea rows={4} placeholder="请输入详细地址" />
          </FormItemDecorator>
          <FormItemDecorator
            required
            form={form}
            label="营业执照"
            field="companyBusinessLicense"
            validator="required"
            options={{
              initialValue: entity && entity.companyBusinessLicense
            }}
            extra={
              <>
                <p>
                  只支持中国大陆工商局或市场监督管理局颁发的工商营业执照，且必须在有效期内。
                </p>
                <p>
                  格式要求：使用营业执照原件或者
                  <span style={{ color: "#f5222d" }}>加盖企业公章</span>
                  的扫描件或复印件，支持jpg、jpeg、png、bmp格式，大小不超过2M。
                </p>
              </>
            }
          >
            <InputWarpperUpload
              data={{
                limitSize: 2 * 1024 * 1024, //2M
                uploadType: UploadType.PICTURE
              }}
            />
          </FormItemDecorator>
          <Divider />
          <div className="form-item-title">入驻业务</div>
          <FormItemDecorator
            required
            form={form}
            label="代理地区"
            field="agencyArea"
            style={{ width: 420 }}
            validator="required"
            options={{
              initialValue: entity && entity.agencyArea
            }}
          >
            <CitySelector type={CitySelectorType.SINGLE} />
          </FormItemDecorator>
          <Divider />
          <ContactForm form={form} contactEntity={contactEntity} />
          <Form.Item>
            <Checkbox onChange={this.agreementChange}>
              我已阅读
              <a onClick={this.props.onAgreement}>
                《喜马拉雅开方平台开发者协议》
              </a>
              ，同意入驻城市服务商系统并接入喜马拉雅开放平台服务。
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type="default"
              style={{ marginLeft: 150, width: 100 }}
              onClick={this.props.onGoBack}
            >
              返回
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!agreement}
              style={{ marginLeft: 30, width: 100 }}
            >
              提交申请
            </Button>
          </Form.Item>
        </Form>
        <Modal
          closable
          maskClosable
          title="提示"
          width={400}
          visible={tipsVisible}
          footer={null}
          onCancel={this.toggleTipsVisible}
        >
          <div className="apply-confirm">
            <p>我已确认信息, 是否确认提交申请？</p>
            <div>
              <Button type="primary" onClick={this.onSubmit}>
                确认
              </Button>
              <Button
                type="dashed"
                onClick={this.toggleTipsVisible}
                style={{ marginLeft: 40 }}
              >
                我在想想
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default Form.create<P>()(ApplyForm);
