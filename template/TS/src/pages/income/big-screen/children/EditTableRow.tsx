import React from "react";
import { Form } from "antd";

interface P {
  form: any;
}
interface S {}
// 自定义行列必须有props否则无td
class EditableFormRow extends React.Component<P, S> {
  render() {
    return <tr {...this.props} />;
  }
}

export default EditableFormRow;
