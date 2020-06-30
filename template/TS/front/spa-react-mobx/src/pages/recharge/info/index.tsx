import * as React from "react";
import {
  Radio,
  Form,
  Select,
  Input,
  Button,
  Tooltip,
  Icon,
  message
} from "antd";
import { FormComponentProps } from "antd/lib/form";
import ContentView from "@/layout/ContentView";
import MainLayout from "@/layout";
import FormItemDecorator from "@/components/FormItemDecorator";
import { VIP_INFO, DEVICE_TYPE } from "../constants";
import CustomUpload from "./customUpload";
import API from "@/api";
import ConfirmInfo from "../confirmInfo";
import { CheckRes, APPList } from "@/api/service/RechargeService";
import { getOpenCreateAPPUrl } from "@/shared/common/utils";

import "./index.scss";

// 充值信息
type P = FormComponentProps & {};
type S = {
  type: string;
  accountType: number;
  appList: object[];
  isConfirm: Boolean;
  isLoading: Boolean;
  chargeInfoData: CheckRes;
};

class ChargeInfo extends React.Component<P, S> {
  state = {
    type: "VIP",
    accountType: 1,
    appList: [],
    isConfirm: false,
    isLoading: false,
    chargeInfoData: null
  };
  componentDidMount() {
    API.recharge.APPList().then(res => {
      // console.log(res);
      if (res.code === 0) {
        this.setState({
          appList: res.data as APPList[]
        });
      }
    });
  }
  onTypeChange = e => {
    this.setState({
      type: e.target.value
    });
  };
  onAccountTypeChange = e => {
    this.setState({
      accountType: e.target.value
    });
  };
  handleUploadSuccess = url => {
    console.log(url);
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log("values=>", values);
      if (!err) {
        console.log("Received values of form: ", values);
        values.mobileList = values.mobileList.split(/,|↵|\\n/);
        values.xiDianNum = +values.xiDianNum;
        this.setState({
          isLoading: true
        });
        API.recharge
          .applyRecharge(values)
          .then(res => {
            if (res.code === 0) {
              this.toRecharge(true);
              this.setState({
                chargeInfoData: res.data as CheckRes
              });
            } else {
              message.error(res.message);
            }
          })
          .finally(() => {
            this.setState({
              isLoading: false
            });
          });
      }
    });
  };
  verifyAlbum = async (rule, value, callback) => {
    // console.log(rule, value);
    if (value) {
      const res = await API.recharge.getAlbumInfo(value);
      if (res.code === 0) {
        callback();
      } else {
        callback(`${value}专辑，未查询到`);
      }
    } else {
      callback("请填写专辑ID");
    }
  };
  toRecharge = (bool: Boolean) => {
    this.setState({
      isConfirm: bool
    });
  };
  render() {
    const {
      type,
      accountType,
      appList,
      isConfirm,
      isLoading,
      chargeInfoData
    } = this.state;
    const { form } = this.props;
    return (
      <MainLayout>
        <div style={{ display: isConfirm ? "none" : "block" }}>
          <ContentView>
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <div className="charge-info-page">
                <div className="charge-info-title">权益充值</div>
                <div className="charge-info">
                  <div className="charge-subtitle">充值内容</div>
                  <div className="charge-content">
                    <div>
                      <FormItemDecorator
                        form={form}
                        field="itemType"
                        options={{
                          initialValue: "VIP"
                        }}
                      >
                        <Radio.Group onChange={this.onTypeChange}>
                          <Radio value={"VIP"}>会员</Radio>
                          <Radio value={"XI_DIAN"}>喜点</Radio>
                          <Radio value={"ALBUM"}>专辑</Radio>
                        </Radio.Group>
                      </FormItemDecorator>
                    </div>

                    {type === "VIP" && (
                      <FormItemDecorator
                        form={form}
                        field="vipType"
                        label="会员类型"
                        options={{
                          // initialValue: "",
                          rules: [
                            {
                              required: true,
                              message: "请选择会员类型"
                            }
                          ]
                        }}
                      >
                        <Select
                          style={{ width: 300 }}
                          size="large"
                          placeholder="请选择会员类型"
                        >
                          {VIP_INFO.map(({ value, label }) => (
                            <Select.Option key={value} value={value}>
                              {label}
                            </Select.Option>
                          ))}
                        </Select>
                      </FormItemDecorator>
                    )}
                    {type === "XI_DIAN" && (
                      <>
                        <FormItemDecorator
                          form={form}
                          field="xiDianNum"
                          label="喜点数"
                          options={{
                            rules: [
                              {
                                required: true,
                                message: "请填写喜点"
                              },
                              {
                                pattern: /^([1-9]\d{0,2}(\.\d{0,2})?|1000)$/,
                                message: "喜点最多1000个"
                              }
                            ]
                          }}
                        >
                          <Input
                            placeholder="请输入充值喜点数，最多1000个"
                            size="large"
                          />
                        </FormItemDecorator>
                        <FormItemDecorator
                          form={form}
                          field="clientOsType"
                          options={{
                            rules: [
                              {
                                required: true,
                                message: "请选择充值的设备系统"
                              }
                            ]
                          }}
                          label={
                            <div className="custom-label">
                              <span style={{ marginRight: 5 }}>
                                充值的设备系统
                              </span>
                              <Tooltip
                                placement="top"
                                title={
                                  <div>
                                    <p>
                                      应苹果公司的规定，虚拟商品使用苹果系统充值不能用于安卓、网页等其他平台。所以在充值喜点的时候，请务必正确选择需要充值的账户所在系统。
                                    </p>
                                    <p>
                                      如果充值的账户用户有使用苹果系统和安卓、网页等其他平台，请先筛选出使用苹果系统的账户，进行充值后，再为其他非苹果系统的用户账户充值。
                                    </p>
                                    <p>
                                      例：A账户选择了苹果系统充值10喜点。A账户在苹果系统的喜马拉雅app内可以正常使用这10个喜点，在苹果系统以外的系统上的喜马拉雅app内无法使用这10个喜点。
                                    </p>
                                  </div>
                                }
                              >
                                <Icon
                                  type="question-circle"
                                  style={{ color: "#DCE0E0" }}
                                />
                              </Tooltip>
                            </div>
                          }
                        >
                          <Select
                            style={{ width: 300 }}
                            size="large"
                            placeholder="请选择充值的设备系统"
                          >
                            <Select.Option value="IOS">IOS</Select.Option>
                            <Select.Option value="ANDROID">
                              安卓/网页等其他系统
                            </Select.Option>
                            {/* {
                              DEVICE_TYPE.map(item=> <Select.Option value={item}>{DEVICE_TYPE[item]}</Select.Option>)
                            } */}
                          </Select>
                        </FormItemDecorator>
                      </>
                    )}
                    {type === "ALBUM" && (
                      <FormItemDecorator
                        form={form}
                        field="albumId"
                        label="专辑ID"
                        validator={this.verifyAlbum}
                        options={{
                          validateTrigger: "onBlur"
                          // rules: [
                          //   {
                          //     required: true,
                          //     message: "请填写专辑ID"
                          //   }
                          // ]
                        }}
                      >
                        <Input
                          placeholder="请输入专辑ID，每次仅支持一个专辑的充值"
                          size="large"
                          style={{ width: 300 }}
                        />
                      </FormItemDecorator>
                    )}
                  </div>
                </div>

                <div className="charge-info">
                  <div className="charge-subtitle">充值账户</div>
                  <div className="charge-content">
                    <div>
                      <FormItemDecorator
                        form={form}
                        field="type"
                        options={{
                          initialValue: 1
                        }}
                      >
                        <Radio.Group onChange={this.onAccountTypeChange}>
                          <Radio value={1}>充值账户</Radio>
                          <Radio value={2}>批量添加</Radio>
                        </Radio.Group>
                      </FormItemDecorator>
                    </div>
                    {accountType === 1 && (
                      <FormItemDecorator
                        form={form}
                        field="mobileList"
                        label="手机号"
                        options={{
                          initialValue: "",
                          rules: [
                            {
                              required: true,
                              message: "请填写手机号"
                            }
                          ]
                        }}
                      >
                        <Input.TextArea
                          style={{ width: 600 }}
                          rows={8}
                          placeholder="请输入要充值的账户手机号，多个账户之间用英文逗号或换行隔开，每次最多充值600个账户"
                        ></Input.TextArea>
                      </FormItemDecorator>
                    )}
                    {accountType === 2 && (
                      <FormItemDecorator
                        form={form}
                        field="mobileList"
                        options={{
                          initialValue: "",
                          rules: [
                            {
                              required: true,
                              message: "请上传正确账号模版"
                            }
                          ]
                        }}
                      >
                        <CustomUpload
                          onSuccess={this.handleUploadSuccess}
                          form={form}
                        />
                      </FormItemDecorator>
                    )}
                  </div>
                </div>

                <div className="charge-info">
                  <div className="charge-subtitle">
                    <span style={{ marginRight: 3 }}>选择应用 </span>
                    <Tooltip
                      placement="top"
                      title={
                        <div>
                          <p>
                            如果第一次权益充值，请先创建一个名为权益充值的应用。
                          </p>
                          <p>
                            创建应用时，名称为：公司名称+权益充值。例如：喜马拉雅权益充值；
                          </p>
                          <p>
                            网址为：权益充值的网址。例如：www.ximalaya.com；
                          </p>
                          <p>
                            创建成功后，请与商务联系，及时走审核流程。商务反馈审核通过后，刷新该页面，选择项会增加“公司名称+权益充值”的应用。
                          </p>
                          <p>
                            创建完成后，每次选择该权益充值应用进行权益充值。
                          </p>
                        </div>
                      }
                    >
                      <Icon
                        type="question-circle"
                        style={{ color: "#DCE0E0", fontSize: 14 }}
                      />
                    </Tooltip>
                    <span
                      style={{
                        color: "#7F8FA4",
                        fontSize: 12,
                        fontWeight: 400
                      }}
                    >
                      （如首次权益充值，请先创建一个权益充值应用）
                    </span>
                    <a href={getOpenCreateAPPUrl()}>
                      <Icon type="plus" />
                      <span>创建应用</span>
                    </a>
                  </div>
                  {appList && appList.length > 0 && (
                    <div className="charge-content">
                      <FormItemDecorator
                        form={form}
                        field="appKey"
                        options={{
                          initialValue: appList[0].appKey
                        }}
                      >
                        <Radio.Group>
                          {appList.map(({ appName, appKey }) => (
                            <Radio key={appKey} value={appKey}>
                              {appName}
                            </Radio>
                          ))}
                        </Radio.Group>
                      </FormItemDecorator>
                    </div>
                  )}
                </div>

                <div className="submit-wrapper">
                  <Button type="primary" htmlType="submit" loading={isLoading}>
                    确认
                  </Button>
                </div>
              </div>
            </Form>
          </ContentView>
        </div>
        <div style={{ display: !isConfirm ? "none" : "block" }}>
          <ConfirmInfo toRecharge={this.toRecharge} data={chargeInfoData} />
        </div>
      </MainLayout>
    );
  }
}

export default Form.create<P>()(ChargeInfo);
