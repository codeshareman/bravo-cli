import * as React from "react";
import SERVICE from "@/api";
import {
  Button,
  Table,
  Modal,
  Input,
  DatePicker,
  Popconfirm,
  message,
  Form
} from "antd";
import FormItemDecorator from "@/components/FormItemDecorator";
import { FormType } from "../enums";
import { CustTextArea } from "@/components/CustComponents";
import moment from "moment";
import { AJAX_STATUS } from "@/utils/constant";
import { FormComponentProps } from "antd/lib/form";

interface P extends FormComponentProps {
  title: string;
  dataSource: any[];
  onQueryInfo: Function;
}
interface S {
  dataSource: any[];
  showModal: boolean;
  isEdit: boolean;
  curId: number;
}

const RangePicker = DatePicker.RangePicker;

class ActivitySetting extends React.Component<P, S> {
  state: S = {
    dataSource: [],
    showModal: false,
    isEdit: false,
    curId: null
  };

  componentDidMount() {
    this.queryActivityInfo();
  }

  handleDelete = async (id: number) => {
    const { dataSource } = this.props;
    const res = await SERVICE.dashboard.deleteInfo(id);

    if (res.code === AJAX_STATUS.SUCCESS) {
      message.success("删除成功");
      this.props.onQueryInfo();
    } else {
      message.error("删除失败");
    }
  };

  handleEdit = (record: any) => {
    const { setFieldsValue } = this.props.form;
    const dateFormat = "YYYY/MM/DD";

    setTimeout(() =>  setFieldsValue({
      title: record.title,
      time: [
        moment(record.time[0], dateFormat),
        moment(record.time[1], dateFormat)
      ],
      address: record.address,
      content: record.content
    }), 0);

    this.setState(
      {
        showModal: true,
        isEdit: true,
        curId: record.id
      }
    );
  };

  handleModalCancel = () => {
    this.setState({
      showModal: false,
      curId: null
    });
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

  updateInfo = async (id: number) => {
    const { getFieldsValue } = this.props.form;
    const fieldsValue = getFieldsValue();
    const dateFormat = "YYYY-MM-DD";
    const postData = {
      id,
      resourceType: FormType.ACTIVITY,
      content: {
        title: fieldsValue.title,
        time: [
          fieldsValue.time[0].format(dateFormat),
          fieldsValue.time[1].format(dateFormat)
        ],
        address: fieldsValue.address,
        content: fieldsValue.content
      }
    };

    const res = await SERVICE.dashboard.updateInfo(postData);

    if (res.code === AJAX_STATUS.SUCCESS) {
      message.success("更新成功");
      this.queryActivityInfo();
    } else {
      message.error("更新失败");
    }
  };

  insertInfo = async () => {
    const { getFieldsValue } = this.props.form;
    const fieldsValue = getFieldsValue();
    const dateFormat = "YYYY-MM-DD";
    const postData = {
      id: 1,
      resourceType: FormType.ACTIVITY,
      content: {
        title: fieldsValue.title,
        time: [
          fieldsValue.time[0].format(dateFormat),
          fieldsValue.time[1].format(dateFormat)
        ],
        address: fieldsValue.address,
        content: fieldsValue.content
      }
    };

    const res = await SERVICE.dashboard.insertInfo(postData);

    if (res.code === AJAX_STATUS.SUCCESS) {
      message.success("新增成功");
      this.queryActivityInfo();
    } else {
      message.error("新增失败");
    }
  };

  // 查询添加的信息
  queryActivityInfo = async () => {
    this.props.onQueryInfo();
  };

  render() {
    const { title, dataSource } = this.props;
    const dateFormat = "YYYY/MM/DD";
    const modalTitle = this.state.isEdit ? "编辑" : "添加";
    const columns = [
      {
        title: "活动名称",
        dataIndex: "title",
        editable: true,
        width: 200,
        key: "title"
      },
      {
        title: "活动时间",
        dataIndex: "time",
        key: "time",
        width: 150,
        align: 'center',
        render: (rangTimer: Array<any>) => {
          return `${rangTimer[0]} ~ ${rangTimer[1]}`;
        }
      },
      {
        title: "活动地址",
        dataIndex: "address",
        width: 200,
        key: "address"
      },
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
    return (
      <div className="config-item">
        <h3>
          <i /> {title}
        </h3>
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={() => {
            this.setState({
              showModal: true,
              isEdit: false
            });
          }}
        >
          添加
        </Button>
        <Table
          rowClassName={() => "activity-row"}
          rowKey={columns[0].key}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
        />
        {/* 添加活动弹框 */}
        <Modal
          visible={this.state.showModal}
          title={modalTitle}
          onCancel={this.handleModalCancel}
          onOk={this.hanleModalConfirm}
          destroyOnClose={true}
        >
          <FormItemDecorator
            form={this.props.form}
            label="活动名称"
            filed="title"
            required
            options={{
              initialValue: "",
                rules: [
                  {
                    required: true,
                    message: "你还未输入活动名称"
                  }
                ]
            }}
          >
            <Input placeholder="活动名称" />
          </FormItemDecorator>
          <FormItemDecorator
            form={this.props.form}
            label="活动时间"
            filed="time"
            options={{
              initialValue: "",
              rules: [
                {
                  required: true,
                  message: "你还未选择活动时间"
                }
              ]
            }}
      
            required
          >
            <RangePicker format={dateFormat} />
          </FormItemDecorator>
          <FormItemDecorator
            form={this.props.form}
            label="活动地址"
            filed="address"
            options={{
              initialValue: "",
              rules: [
                {
                  required: true,
                  message: "你还未输入活动地址"
                }
              ]
            }}
            required
          >
            <Input placeholder="活动举办地址" />
          </FormItemDecorator>
          <FormItemDecorator
            form={this.props.form}
            label="活动内容"
            filed="content"
            options={{
              initialValue: "",
              rules: [
                {
                  required: true,
                  message: "你还未输入活动内容"
                }
              ]
            }}
            required
          >
            <CustTextArea
              limit={100}
              autosize={{ minRows: 5, maxRows: 5 }}
              placeholder="请输入活动主要信息"
            />
          </FormItemDecorator>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ActivitySetting);
