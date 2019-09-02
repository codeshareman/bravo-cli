import * as React from "react";
import { connect } from "react-redux";
import { Form, Select, Col, Row, DatePicker, Input, Cascader } from "antd";

import FormItemDecorator from "@/components/FormItemDecorator";
import { FormComponentProps } from "antd/lib/form";
import { SET_BOARD_PARAMS } from "@/store/actionTypes/viewboard";
import { StatisticalType } from "../../../../../../client/service/DashboardService2";
import { getCasaderData, formatDateTime } from "@/utils/Helper";
import moment from "moment";
import "./index.scss";
import { USER_INFO } from "@/utils/constant";
import { AgentMode } from "@/utils/enums";

interface P extends FormComponentProps {
  title: string;
  viewBoard: {
    queryParams: Object;
  };
  setBoardParams: (data: Object) => {};
  isVipConverse?: boolean;
  onSubmit?: Function;
}
interface S {}

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const labelColGrid = {
  xs: 24,
  sm: 6,
  md: 10,
  lg: 6,
  xl: 7,
  xxl: 7
};

class ChartQuery extends React.Component<P, S> {
  handleSubmit = () => {
    const { getFieldsValue } = this.props.form;
    setTimeout(() => {
      const { onSubmit } = this.props;
      const chartParams = getFieldsValue();
      this.props.setBoardParams(chartParams);
      onSubmit && onSubmit();
    });
  };

  render() {
    const { form, isVipConverse = false } = this.props;
    const areaList = getCasaderData();
    const dateFormat = "YYYY/MM/DD";
    const toDate = formatDateTime(Date.now(), "/");
    const fromDate = formatDateTime(Date.now() - 24 * 60 * 60 * 30 * 1000, "/");
    const showArea = !isVipConverse;

    return (
      <div className="query-layout">
        <h2>{this.props.title}</h2>
        <Form layout={"inline"}>
          <Row className="form-row" gutter={20}>
            {/* {showArea && ( */}
            <FormItemDecorator
              form={form}
              label="区域/城市"
              filed="area"
              required={false}
              options={{ initialValue: [] }}
            >
              <Cascader
                style={{ width: 120 }}
                placeholder={"全国"}
                options={areaList}
                disabled={!showArea}
                onChange={showArea && this.handleSubmit}
                expandTrigger="hover"
                changeOnSelect
              />
            </FormItemDecorator>
            {/* )} */}
            <FormItemDecorator
              form={form}
              label="图书馆名称"
              filed="queryString"
              required={false}
              options={{ initialValue: "" }}
            >
              <Input
                style={{ width: 200 }}
                placeholder="请输入图书馆名称或ID"
                onChange={this.handleSubmit}
              />
            </FormItemDecorator>
            <FormItemDecorator
              form={form}
              label="日期"
              filed="rangeTime"
              options={{
                initialValue: [
                  moment(fromDate, dateFormat),
                  moment(toDate, dateFormat)
                ]
              }}
            >
              <RangePicker
                style={{ width: 220 }}
                onChange={this.handleSubmit}
                allowClear={false}
              />
            </FormItemDecorator>
            <FormItemDecorator
              form={form}
              label="维度"
              filed="dismension"
              required={false}
              options={{ initialValue: StatisticalType.DAY }}
            >
              <Select onChange={this.handleSubmit} style={{ width: 80 }}>
                <Option key={StatisticalType.DAY} value={StatisticalType.DAY}>
                  日
                </Option>
                <Option key={StatisticalType.WEEK} value={StatisticalType.WEEK}>
                  周
                </Option>
                <Option
                  key={StatisticalType.MONTH}
                  value={StatisticalType.MONTH}
                >
                  月
                </Option>
              </Select>
            </FormItemDecorator>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    viewBoard: state.viewBoard
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    setBoardParams: (data: number) => {
      dispatch({
        type: SET_BOARD_PARAMS,
        payload: data
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create<P>()(ChartQuery));
