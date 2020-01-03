import * as React from "react";
import {
  Button,
  DatePicker,
  Table,
  message,
  Form,
  Row,
  Col,
  Input,
  Select
} from "antd";
import ContentView from "@/layout/ContentView";
import MainLayout from "@/layout";
import { FormComponentProps } from "antd/lib/form";
import API from "@/api";

import "./index.scss";

const { Option } = Select;
const { RangePicker } = DatePicker;
const columns = [
  {
    title: "任务",
    dataIndex: "taskId",
    key: "taskId"
  },
  {
    title: "权益类型",
    dataIndex: "itemType",
    key: "itemType"
  },
  {
    title: "权益内容",
    dataIndex: "item",
    key: "item"
  },
  {
    title: "单价",
    dataIndex: "price",
    key: "price"
  },
  {
    title: "折扣",
    dataIndex: "discount",
    key: "discount"
  },
  {
    title: "充值帐户所在系统",
    dataIndex: "clientOsType",
    key: "clientOsType"
  },
  {
    title: "充值时间",
    dataIndex: "createTime",
    key: "createTime"
  },
  {
    title: "任务状态",
    dataIndex: "taskState",
    key: "taskState"
  },
  {
    title: "操作",
    dataIndex: "taskId",
    key: "action",
    render: (taskId) => (
      <span>
        <a href={`${window.location.origin}/portal-provider/batchRecharge/downloadExcel/${taskId}`}>下载</a>
      </span>
    )
  }
];


type P = FormComponentProps & {};
type S = {
  current: number;
  pageSize: number;
  total: number;
  data: object[]
};

class RechargeRecord extends React.Component<P, S> {
  state = {
    current: 1,
    pageSize: 10,
    total: 0,
    data:[]
  };
  componentDidMount() {
    this.searchTaskList()
  }
  handleSearch = e => {
    e.preventDefault();
    this.searchTaskList();
  };
  handlePageChage = pagination => {
    console.log(pagination);
    const { current, pageSize, total } = pagination;
    this.setState(
      {
        current,
        pageSize,
        total
      },
      () => {
        this.searchTaskList();
      }
    );
  };
  searchTaskList = () => {
    const { current, pageSize } = this.state;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        // console.log(values.time[0].format());
        values.pageNum = current;
        values.pageSize = pageSize;
        const [start, end] = values.time||[];
        if (start && end) {
          values.startTime = new Date(start.format()).getTime();
          values.endTime = new Date(end.format()).getTime();
        }
        const res = await API.recharge.queryTaskList(values);
        if(res.code===0){
          this.setState({
            data: res.data.list
          })
        }else{
          message.error(res.message)
        }
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const {data, current, total, pageSize} = this.state
    return (
      <MainLayout>
        <ContentView>
          <div className="recharge-record-page">
            <div className="charge-record-title">充值记录</div>
            <Form className="record-search-from" onSubmit={this.handleSearch}>
              <Row>
                <Col span={8}>
                  <Form.Item label="任务号" colon={false}>
                    {getFieldDecorator("taskId")(
                      <Input placeholder="请输入任务号" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="任务状态" colon={false}>
                    {getFieldDecorator("taskState")(
                      <Select placeholder="选择任务状态">
                        <Option value="1">1</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="交易时间" colon={false}>
                    {getFieldDecorator("time")(<RangePicker />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="权益类型" colon={false}>
                    {getFieldDecorator("itemType")(
                      <Select placeholder="选择权益类型">
                        <Option value="1">1</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="充值内容" colon={false}>
                    {getFieldDecorator("itemId")(
                      <Input placeholder="填写充值内容" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginLeft: 58 }}
                  >
                    查询
                  </Button>
                </Col>
              </Row>
            </Form>
            <Table
              rowKey="taskId"
              columns={columns}
              dataSource={data}
              onChange={this.handlePageChage}
              pagination={{
                pageSize,
                current,
                showQuickJumper: true,
                total,
                showSizeChanger: true,
                showTotal: total => `共${total}条记录`
              }}
            />
          </div>
        </ContentView>
      </MainLayout>
    );
  }
}

export default Form.create({ name: "record_search" })(RechargeRecord);
