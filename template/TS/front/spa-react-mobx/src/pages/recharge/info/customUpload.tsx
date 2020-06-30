import React from "react";
import { Upload, message, Button, Icon } from "antd";
import {
  FormComponentProps,
} from "antd/lib/form/Form";
import { FormItemProps } from "antd/lib/form/FormItem";


type P = FormComponentProps &
  FormItemProps & {
    onSuccess(data: string[]);
  };
type S = {
  // fieldList: object[],
  name: string;
};

const props = {
  name: "file",
  showUploadList: false,
  action: "/portal-provider/batchRecharge/updateExcel"
};

class CustomUpload extends React.Component<P, S> {
  state = {
    name: ""
  };
  loadTemplate = e => {
    e.preventDefault();
    const origin = location.origin;
    window.open(
      `${origin}/portal-provider/batchRecharge/downloadExcelTemplate`
    );
  };
  remove = () => {
    this.setState({
      name: ""
    });
    // this.props.onSuccess([]);
    this.props.form.setFieldsValue({
      mobileList:""
    })
  };
  handleChange = info => {
    console.log(info);
    this.setState({
      name: info.file.name
    });
    if (info.file.status === "done") {
      const { data, code, message: msg } = info.file.response;
      if (code === 0) {
        this.props.onSuccess(data);
        this.props.form.setFieldsValue({
          mobileList:data.join()
        })
      } else {
        message.error(msg);
      }
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  render() {
    const { name } = this.state;
    return (
      <div className="custom-upload-comp">
        <Upload {...props} onChange={this.handleChange}>
          <Button style={{ width: 200, marginRight: 20 }}>
            <Icon type="upload" /> Click to Upload
          </Button>
        </Upload>
        <a
          href=""
          onClick={this.loadTemplate}
          style={{ color: "#215FFF", fontSize: 14 }}
        >
          下载批量充值账户模板
        </a>
        {name && (
          <p style={{ background:'#BFD1FF', textAlign:"center", borderRadius:4}}>
            <Icon type="link" />
            <span style={{ marginRight: 16, marginLeft: 8 }}>{name}</span>
            <Icon type="close" onClick={this.remove} />
          </p>
        )}
      </div>
    );
  }
}

export default CustomUpload;
