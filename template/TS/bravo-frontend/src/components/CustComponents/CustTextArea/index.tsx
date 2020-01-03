import React, { Component } from "react";
import { Input } from "antd";
import { TextAreaProps } from "antd/lib/input/TextArea";
import "./index.scss";

type P = TextAreaProps & {
  limit: number;
};
type S = {
  textCount: number;
};

const { TextArea } = Input;

/**
 * TextArea框末尾增加字数提示功能  eg: 10/26
 */

export default class CustTextArea extends Component<P, S> {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      textCount: value ? value.length : 0
    };
  }

  handleChange = e => {
    const { value } = e.target;
    this.setState({
      textCount: value ? value.length : 0
    });
    this.props.onChange(value);
  };

  render() {
    const { limit, onChange, ...rest } = this.props;
    const { textCount } = this.state;
    return (
      <div className="wws-cust-textarea">
        <TextArea maxLength={limit} onChange={this.handleChange} {...rest} />
        <span className="wws-cust-textarea-suffix">{`${textCount}/${limit}`}</span>
      </div>
    );
  }
}
