import React, { Component, ReactNode } from "react";
import { Upload, Button, Icon, message } from "antd";
import { UploadProps } from "antd/lib/upload";
import fileUpload, { UploadType } from "./fileUpload";

export type IUploadData = {
  buttonText?: string; //按钮文本
  limitSize?: number; //大小限制
  uploadType: UploadType;
};

type P = {
  data?: IUploadData; //自定义属性
  needProgress: boolean;
  title?: string;
  options: UploadProps; //upload 组件属性
  onSuccess(url: string);
  children?: ReactNode; //自定义样式
};

type S = {
  progress: number;
  defTitle: string;
  fileList: object[];
};

class ClampUpload extends Component<P, S> {
  constructor(props) {
    super(props);
  }

  state = {
    progress: 0,
    defTitle: "上传",
    fileList: []
  };

  handleSuccess = url => {
    const { onSuccess, needProgress } = this.props;
    onSuccess && onSuccess(url);
    //隐藏上传进度条
    needProgress &&
      setTimeout(() => {
        this.setState({
          progress: 0
        });
      }, 500);
  };
  handleUpdateProgress = ({ percent }, file) => {
    this.setState({
      progress: percent
    });
    console.log("onProgress", `${percent}%`, file.name);
  };

  componentDidCatch() {
    console.log("upload error");
  }

  customRequest = ({ data, file, filename }) => {
    fileUpload({
      data,
      file,
      filename,
      onError: err => {
        message.error(err.message);
      },
      onProgress: this.handleUpdateProgress,
      onSuccess: this.handleSuccess
    });
  };

  onChange = file => {
    console.log({ file });
  };

  renderDefault = () => {
    const { data, options } = this.props;
    const { defTitle } = this.state;
    const { listType = "picture-card" } = options;
    let ele = null;
    if (listType === "picture-card") {
      ele = (
        <div className="voi-upload-plus">
          <Icon type="plus" />
          <p className="ant-upload-text">
            {(data && data.buttonText) || defTitle}
          </p>
        </div>
      );
    } else {
      ele = (
        <Button icon="upload">{(data && data.buttonText) || defTitle}</Button>
      );
    }
    return ele;
  };

  render() {
    const { data, needProgress, options, children } = this.props;
    const { progress } = this.state;
    const { listType = "picture-card", ...rest } = options;
    return (
      <div className="voi-upload-box">
        <Upload
          data={data}
          customRequest={this.customRequest}
          onChange={this.onChange}
          listType={listType}
          {...rest}
        >
          {children ? children : this.renderDefault()}
          {needProgress ? (
            <div className="voi-upload-progress">
              <div
                className="voi-upload-bar"
                style={{ width: progress + "%" }}
              />
            </div>
          ) : null}
        </Upload>
      </div>
    );
  }
}

export default ClampUpload;
