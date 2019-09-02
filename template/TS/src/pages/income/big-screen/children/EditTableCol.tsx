import React from "react";
import { Form, Input } from "antd";
import FormItemDecorator from "@/components/FormItemDecorator";

interface P {
  record: any;
  dataIndex: number;
  title: string;
  isEdit: boolean;
  form: any;
}
interface S {}

class EditableCell extends React.Component<P, S> {
  state = {
    editing: false
  };

  // toggleEdit = () => {
  //   const editing = !this.state.editing;
  //   this.setState({ editing }, () => {
  //     if (editing) {
  //       this.input.focus();
  //     }
  //   });
  // };

  // save = e => {
  //   const { record, handleSave } = this.props;
  //   this.form.validateFields((error, values) => {
  //     if (error && error[e.currentTarget.id]) {
  //       return;
  //     }
  //     this.toggleEdit();
  //     handleSave({ ...record, ...values });
  //   });
  // };

  // renderCell = form => {
  //   this.form = form;
  //   const { children, dataIndex, record, title } = this.props;
  //   const { editing } = this.state;
  //   return editing ? (
  //     <Form.Item style={{ margin: 0 }}>
  //       {form.getFieldDecorator(dataIndex, {
  //         rules: [
  //           {
  //             required: true,
  //             message: `${title} is required.`
  //           }
  //         ],
  //         initialValue: record[dataIndex]
  //       })(
  //         <Input
  //           ref={node => (this.input = node)}
  //           onPressEnter={this.save}
  //           onBlur={this.save}
  //         />
  //       )}
  //     </Form.Item>
  //   ) : (
  //     <div
  //       className="editable-cell-value-wrap"
  //       style={{ paddingRight: 24 }}
  //       onClick={this.toggleEdit}
  //     >
  //       {children}
  //     </div>
  //   );
  // };

  componentDidMount() {}

  renderCell = () => {
    const { dataIndex, record, children, isEdit, form } = this.props;

    if (isEdit) {
      return (
        <td>
          <FormItemDecorator
            form={form}
            filed={String(dataIndex)}
            options={{ initialValue: record[dataIndex] }}
          >
            <Input placeholder="" />
          </FormItemDecorator>
        </td>
      );
    } else {
      return <td>{children}</td>;
    }
  };

  render() {
    const { dataIndex, title, record, children } = this.props;
    return this.renderCell();
  }
}

export default EditableCell;
