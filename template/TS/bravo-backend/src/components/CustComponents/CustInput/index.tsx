import React, { Component } from "react";
import { Input } from "antd";
import { InputProps } from "antd/lib/input";

type P = InputProps & {
  limit: number;
};

type S = {
  textCount: number;
};
/**
 * Input框末尾增加字数提示功能  eg: 10/26
 */
class CustInput extends Component<P, S> {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      textCount: value ? value.length : 0
    };
  }

  handleChange = e => {
    const { value } = e.target;
    const length = value.length || 0;
    this.setState({
      textCount: length
    });
    this.props.onChange(value);
  };
  render() {
    const { limit = 0, onChange, ...rest } = this.props;
    const { textCount } = this.state;
    return (
      <Input
        suffix={`${textCount}/${limit}`}
        maxLength={limit}
        onChange={this.handleChange}
        {...rest}
      />
    );
  }
}

export default CustInput;
