import React, { Component } from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';

type P = ButtonProps & {};
type S = {};

// 权限按钮
class AuthButton extends Component<P, S> {
  render() {
    const rest = this.props;
    return <Button {...rest}>{this.props.children}</Button>;
  }
}

export default AuthButton;
