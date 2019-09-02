import * as React from "react";
import { connect } from "react-redux";

import FormItemDecorator from "@/components/FormItemDecorator";
import { Form, Radio } from "antd";
import { OptionTypes, RegionDimensionType } from "./enums";
import { FormComponentProps } from "antd/lib/form";
import { SET_BOARD_PARAMS } from "@/store/actionTypes/viewboard";
import "./index.scss";
import { USER_INFO } from "@/utils/constant";
import { AgentMode } from "@/utils/enums";

const RadioGroup = Radio.Group;
const labelColGrid = {
  xs: 24,
  sm: 4,
  md: 2,
  lg: 4,
  xl: 4,
  xxl: 4
};
const wrapperColGrid = {
  xs: 24,
  sm: 20,
  md: 22,
  lg: 20,
  xl: 20,
  xxl: 20
};

interface P extends FormComponentProps {
  options: OptionTypes[];
  onSubmit?: Function;
  viewBoard: {
    queryParams: Object;
  };
  setBoardParams: (data: Object) => {};
}

interface S {}

// 组合过滤查询
class CombineFilter extends React.Component<P, S> {
  componentDidMount() {
    this.handleSubmit();
  }

  handleSubmit = async () => {
    const { getFieldsValue } = this.props.form;
    setTimeout(() => {
      const values = getFieldsValue();
      this.props.setBoardParams(values);
      this.props.onSubmit(values);
    });
  };

  // 渲染筛选项
  renderFilterOptions = () => {
    let flag = false;
    const { options, form } = this.props;
    const showRegionDimension =
      USER_INFO.roleType === "AGENT" &&
      ((USER_INFO.agentMode === AgentMode.postalGroup &&
        USER_INFO.agentLevel >= 1) ||
        USER_INFO.agentMode === AgentMode.serviceGroup);

    return options.map((item, index) => {
      if (showRegionDimension) {
        flag = true;
      } else {
        flag = item.field !== "regionType";
      }

      if (flag) {
        return (
          <FormItemDecorator
            key={index}
            form={form}
            required={false}
            label={item.title}
            // labelCol={labelColGrid}
            wrapperCol={wrapperColGrid}
            filed={item.field}
            options={{ initialValue: item.defalutVal }}
          >
            <RadioGroup
              disabled={item.disabled || false}
              onChange={this.handleSubmit}
              buttonStyle={"solid"}
            >
              {item.options.map((cItem, cIndex) => {
                return (
                  <Radio.Button key={cIndex} value={cItem.value}>
                    {cItem.label}
                  </Radio.Button>
                );
              })}
            </RadioGroup>
          </FormItemDecorator>
        );
      }
    });
  };

  render() {
    return (
      <div className="cf-wrapper">
        <Form layout={"inline"}>{this.renderFilterOptions()}</Form>
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
    setBoardParams: (data: Object) => {
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
)(Form.create<P>()(CombineFilter));
