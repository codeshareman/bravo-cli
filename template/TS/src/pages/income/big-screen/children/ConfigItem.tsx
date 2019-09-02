import * as React from "react";
import SERVICE from "@/api";
import FormItemDecorator from "@/components/FormItemDecorator";
import {
  Button,
  Table,
  Input,
  Modal,
  Popconfirm,
  InputNumber,
  Select,
  message,
  Form
} from "antd";
import { ColumnProps } from "antd/lib/table";
import { FormType } from "../enums";
import { getFileItem } from "antd/lib/upload/utils";
import { AJAX_STATUS } from "@/utils/constant";
import { FormComponentProps } from "antd/lib/form";

interface P extends FormComponentProps {
  title: string;
  dataSource: any[];
  columns: ColumnProps<any>[];
  type: FormType;
  canAdd?: boolean;
  onQueryInfo: Function;
  components: {
    body?: {
      wrapper?: any;
      row?: any;
      cell?: any;
    };
  };
}
interface S {
  curDataSource: any[];
  showModal: boolean;
  curId: number;
}

const Option = Select.Option;

class ConfigItem extends React.Component<P, S> {
  state: S = {
    curDataSource: [],
    showModal: false,
    curId: null
  };

  componentDidMount() {
    this.queryInfo();
  }

  // 添加行
  handleAddRow = () => {
    this.setState({
      showModal: true
    });
  };

  handleModalCancel = () => {
    this.setState({
      showModal: false
    });
  };

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err: any, val: any) => {
      if (!err) {
        this.hanleModalConfirm();
      }
    });
  };

  updateInfo = async (id: number) => {
    const { type } = this.props;
    const { getFieldValue } = this.props.form;
    const { columns } = this.props;
    let contentFields = {};

    columns.forEach(item => {
      contentFields[item.dataIndex] = getFieldValue(item.dataIndex);
    });

    const postData = {
      id,
      resourceType: type,
      content: contentFields
    };

    const res = await SERVICE.dashboard.updateInfo(postData);

    if (res.code === AJAX_STATUS.SUCCESS) {
      message.success("更新成功");
      this.queryInfo();
    } else {
      message.error("更新失败");
    }
  };

  insertInfo = async () => {
    const { type } = this.props;
    const { getFieldValue, resetFields } = this.props.form;
    const { columns } = this.props;
    let contentFields = {};

    columns.forEach(item => {
      contentFields[item.dataIndex] = getFieldValue(item.dataIndex);
    });

    const postData = {
      id: 1,
      resourceType: type,
      content: contentFields
    };

    const res = await SERVICE.dashboard.insertInfo(postData);

    if (res.code === AJAX_STATUS.SUCCESS) {
      message.success("新增成功");
      this.queryInfo();
    } else {
      message.error("新增失败");
    }
  };

  hanleModalConfirm = async () => {
    const { curId } = this.state;

    if (curId) {
      this.updateInfo(curId);
    } else {
      this.insertInfo();
    }

    this.setState({
      showModal: false,
      curId: null
    });
  };

  // 查询添加的信息
  queryInfo = async () => {
    const { type } = this.props;
    this.props.onQueryInfo(type);
  };

  renderFormFields = () => {
    const { type } = this.props;
    const yearOptions = [];
    const currentYear = new Date().getFullYear();

    for (let i = currentYear; i < 2800; i++) {
      yearOptions.push(i);
    }

    switch (type) {
      case FormType.GOAL:
        return (
          <div>
            <FormItemDecorator
              key={"year"}
              form={this.props.form}
              label={"年份"}
              filed="year"
              required
              options={{
                initialValue: new Date().getFullYear(),
                rules: [
                  {
                    required: true,
                    message: "你还未选择年份"
                  }
                ]
              }}
            >
              <Select style={{ width: 200 }} >
                {yearOptions.map((year, index) => {
                  return (
                    <Option key={index} value={year}>
                      {year}
                    </Option>
                  );
                })}
              </Select>
            </FormItemDecorator>
            <FormItemDecorator
              key={"target"}
              form={this.props.form}
              label={"目标"}
              filed="target"
              options={{
                rules: [
                  {
                    required: true,
                    message: "你还未输入年度目标"
                  },
                  {
                    pattern: /^\d*$/,
                    message: "你输入的内容格式不正确"
                  }
                ]
              }}
              required
            >
              <Input placeholder="目标" style={{ width: 180 }} />
            </FormItemDecorator>
            <FormItemDecorator
              key={"coverage"}
              form={this.props.form}
              label={"城市覆盖率"}
              filed="coverage"
              validator={(rule, value, callback) => {
                if (!value) {
                  callback("你还未输入城市覆盖率");
                  return;
                }

                if (/^\d+$/.test(value)) {
                  if (value < 0 || value > 100) {
                    callback("请输入0~100的数字");
                  } else {
                    callback();
                  }
                } else {
                  callback("你输入的内容格式不正确");
                }
              }}
              required
            >
              <Input
                placeholder="城市覆盖率"
                style={{ width: 150 }}
                addonAfter={"%"}
              />
            </FormItemDecorator>
          </div>
        );
      case FormType.INCREASE:
      case FormType.DISTRIBUTE:
        return (
          <div>
            <FormItemDecorator
              key={"city"}
              form={this.props.form}
              label={"城市"}
              filed="city"
              options={{
                rules: [
                  {
                    required: true,
                    message: "你还未输入城市"
                  }
                ]
              }}
              required
            >
              <Input placeholder="城市" style={{ width: 200 }} />
            </FormItemDecorator>
            <FormItemDecorator
              key={"amount"}
              form={this.props.form}
              label={"数量"}
              filed="amount"
              options={{
                rules: [
                  {
                    required: true,
                    message: "你还未输入数量"
                  },{
                    pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                    message: "你输入的数量不正确"
                  }
                ]
              }}
              required
            >
              <InputNumber placeholder="数量" style={{ width: 120 }} />
            </FormItemDecorator>
          </div>
        );
    }
  };

  handleEdit = (record: any) => {
    const { setFieldsValue } = this.props.form;
    
    setTimeout(() => setFieldsValue(record), 0);

    this.setState({
      showModal: true,
      curId: record.id
    });
  };


  handleDelete = async (id: number) => {
    const res = await SERVICE.dashboard.deleteInfo(id);

    if (res.code === AJAX_STATUS.SUCCESS) {
      message.success("删除成功");
      this.queryInfo();
    } else {
      message.error("删除失败");
    }
  };

  render() {
    const {
      title,
      components,
      columns,
      dataSource,
      type,
      canAdd = true
    } = this.props;
    const tableColumns = [
      ...columns,
      {
        title: "操作",
        dataIndex: "actions",
        key: "actions",
        width: 100,
        render: (text, record: any) => {
          return (
            <div className="actions">
              <a onClick={() => this.handleEdit(record)}>编辑</a>
              <Popconfirm
                title="确认要删除吗？"
                onConfirm={() => this.handleDelete(record.id)}
              >
                <a>删除</a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
    const modalTitle = "添加";
    
    return (
      <div className="config-item">
        <h3>
          <i /> {title}
        </h3>
        {canAdd && (
          <Button
            type="primary"
            style={{ marginBottom: 16 }}
            onClick={this.handleAddRow}
          >
            添加
          </Button>
        )}
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          rowKey={columns[0].dataIndex}
          dataSource={dataSource}
          columns={tableColumns}
          pagination={false}
          bordered
        />
        {/* 添加弹框 */}
        <Modal
          visible={this.state.showModal}
          title={modalTitle}
          onCancel={this.handleModalCancel}
          onOk={this.handleSubmit}
          destroyOnClose={true}
        >
          {this.renderFormFields()}
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ConfigItem);
