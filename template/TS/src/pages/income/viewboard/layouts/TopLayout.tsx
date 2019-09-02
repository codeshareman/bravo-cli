import * as React from "react";
import { connect } from "react-redux";
import { Form, Select, message, Badge } from "antd";

import SERVICE from "@/api";
import FormItemDecorator from "@/components/FormItemDecorator";
import { FormComponentProps } from "antd/lib/form";
import { SET_BOARD_PARAMS } from "@/store/actionTypes/viewboard";
import "../styles/top-layer.scss";
import { AJAX_STATUS } from "@/utils/constant";

interface P extends FormComponentProps {
  viewBoard: {
    queryParams: Object;
  };
  setBoardParams: (data: Object) => {};
  setCompoType: (type: number) => {};
}
interface S {
  libraryNum: number;
}

const Option = Select.Option;
const labelColGrid = {
  xs: 24,
  sm: 4,
  md: 2,
  lg: 7,
  xl: 7,
  xxl: 7
};
const wrapperColGrid = {
  xs: 24,
  sm: 8,
  md: 6,
  lg: 6,
  xl: 4,
  xxl: 4
};

class TopLayout extends React.Component<P, S> {
  state: S = {
    libraryNum: 0
  };

  componentDidMount() {
    this.getLibraryNum();
    this.props.setBoardParams({
      productVal: 1
    });
  }

  handleSubmit = (value: number) => {
    this.props.setBoardParams({
      productVal: value
    });
  };

  // 获取图书馆数量
  getLibraryNum = async () => {
    const res = await SERVICE.viewboard.countLibrary();

    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        libraryNum: res.data
      });
    } else {
      message.error(res.message);
    }
  };

  renderProjectOption = () => {
    const options = [
      {
        name: "有声图书馆",
        value: 1
      }
    ];
    return options.map((item, index) => {
      return (
        <Option key={index} value={item.value}>
          {item.name}
        </Option> 
      );
    });
  };

  render() {
    const { form } = this.props;
    return (
      <div className="top-wrapper">
        <Form layout="inline" className="">
          <FormItemDecorator
            form={form}
            label="项目/产品"
            filed="productVal"
            labelCol={labelColGrid}
            wrapperCol={wrapperColGrid}
            required={false}
            options={{ initialValue: 1 }}
          >
            <Select style={{ width: 200 }} onChange={this.handleSubmit}>
              {this.renderProjectOption()}
            </Select>
          </FormItemDecorator>
          <div className="lib-num">
            图书馆数量： <Badge count={this.state.libraryNum} overflowCount={9999999} showZero />
          </div>
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
)(Form.create()(TopLayout));
