import * as React from "react";
import SERVICE from "@/api";

import {
  Form,
  Table,
  Input,
  Button,
  PageHeader,
  Popconfirm,
  message
} from "antd";
import EditTableRow from "./children/EditTableRow";
import EditTableCol from "./children/EditTableCol";
import ConfigItem from "./children/ConfigItem";
import ActivitySetting from "./children/ActivitySetting";
import { FormComponentProps } from "antd/lib/form";
import FormItemDecorator from "@/components/FormItemDecorator";
import { CustTextArea } from "@/components/CustComponents";
import { FormType } from "./enums";
import { MainContent } from "@/layout";
import "./index.scss";
import { AJAX_STATUS } from "@/utils/constant";

interface P extends FormComponentProps {}
interface S {}

const TextArea = Input.TextArea;
// 大屏配置中心
class BigScreenConfig extends React.Component<P, S> {
  state = {
    targetSource: [],
    targetColumns: [
      {
        title: "年份",
        dataIndex: "year",
        editable: true,
        key: "year"
      },
      {
        title: "目标",
        dataIndex: "target",
        key: "target"
      },
      {
        title: "城市覆盖率",
        dataIndex: "coverage",
        key: "coverage",
        render: (curVal) => {
          return curVal + "%"
        }
      }
    ],
    distributeSource: [],
    distributeColumns: [
      {
        title: "城市",
        dataIndex: "city",
        key: "city"
      },
      {
        title: "数量",
        dataIndex: "amount",
        key: "amount"
      }
    ],
    increaseSource: [],
    increaseColumns: [
      {
        title: "城市",
        dataIndex: "city",
        key: "city"
      },
      {
        title: "新增数量",
        dataIndex: "amount",
        key: "amount"
      }
    ],
    activitySource: []
  };

  componentDidMount() {
    this.queryInfo(FormType.DESCRIPTION);
  }

  getCells = (columns: any) => {
    return (
      columns &&
      columns.map((col: any) => {
        return {
          ...col,
          onCell: (record: any) => ({
            record,
            dataIndex: col.dataIndex,
            title: col.title,
            isEdit: false,
            form: this.props.form
          })
        };
      })
    );
  };

  queryInfo = async (type: FormType) => {
    const { setFieldsValue } = this.props.form;
    const res = await SERVICE.dashboard.queryInfo(type);
    const keyArr = ["targetSource", "distributeSource", "increaseSource"];
    const datakey = keyArr[type - 1];
    let filterData = [];

    if (res.code === AJAX_STATUS.SUCCESS) {
      const datasource = res.data.map((item, index: number) => {
        return {
          id: item.id,
          ...item.content
        };
      });
      this.setState({
        [datakey]: datasource
      });

      //  如果是文案描述
      if (type === FormType.DESCRIPTION) {
        setFieldsValue({
          desc: datasource[0].desc
        });
      }

    } else {
      message.error("获取列表信息失败~");
    }
  };

  // 查询活动信息
  queryActivityInfo = async () => {
    const res = await SERVICE.dashboard.queryInfo(FormType.ACTIVITY);
    if (res.code === AJAX_STATUS.SUCCESS) {
      const dataSource = res.data.map((item: any, index: number) => {
        return {
          id: item.id,
          ...item.content
        };
      });

      this.setState({
        activitySource: dataSource
      });
    } else {
      message.error("获取列表信息失败~");
    }
  };

  handleSave = async () => {
    const { getFieldValue } = this.props.form;
    const postData = {
      id: 1,
      resourceType: FormType.DESCRIPTION,
      content: {
        desc: getFieldValue("desc")
      }
    };
    const res = await SERVICE.dashboard.insertInfo(postData);
    if (res.code === AJAX_STATUS.SUCCESS) {
      message.success("保存成功");
    }
  };

  render() {
    // 自定义行列
    const components = {
      body: {
        row: EditTableRow,
        cell: EditTableCol
      }
    };
    return (
      <MainContent
        pageHeader={{
          title: "大屏数据配置",
          hidePageHeader: false
        }}
      >
        <div className="config-wrapper">
          <ConfigItem
            key={"target"}
            title={"全省年度目标"}
            type={FormType.GOAL}
            components={components}
            dataSource={this.state.targetSource}
            columns={this.getCells(this.state.targetColumns)}
            onQueryInfo={this.queryInfo}
          />
          <ConfigItem
            key={"distribute"}
            title={"全省分布数据"}
            canAdd={true}
            type={FormType.DISTRIBUTE}
            components={components}
            dataSource={this.state.distributeSource}
            columns={this.getCells(this.state.distributeColumns)}
            onQueryInfo={this.queryInfo}
          />
          <ConfigItem
            key={"increase"}
            title={"全省新增数据"}
            canAdd={true}
            type={FormType.INCREASE}
            components={components}
            dataSource={this.state.increaseSource}
            columns={this.getCells(this.state.increaseColumns)}
            onQueryInfo={this.queryInfo}
          />
          <ActivitySetting
            title={"活动内容"}
            dataSource={this.state.activitySource}
            onQueryInfo={this.queryActivityInfo}
          />
          {/* 有价值的文案 */}
          <div className="config-item text-config">
            <h3>
              <i /> 有声图书馆价值的文案
            </h3>
            <Button type="primary" onClick={this.handleSave}>
              保存
            </Button>
            <FormItemDecorator
              form={this.props.form}
              label=""
              filed="desc"
              required
            >
              <CustTextArea limit={100} autosize={{ minRows: 5, maxRows: 5 }} />
            </FormItemDecorator>
          </div>
        </div>
      </MainContent>
    );
  }
}

export default Form.create()(BigScreenConfig);
