import React, { Component } from 'react';
import { Select, message } from 'antd';

import './index.scss';
import API from '@/api';
import { AJAX_STATUS } from '@/shared/common/constants';
import { SelectProps } from 'antd/lib/select';

const { Option } = Select;

type P = SelectProps & {
  onChange?(value?: number): any;
  onSubmit?(id?: any, role?: any): any;
};
type S = {
  roleList: Array<any>;
};

// 角色选择器
class CustRoleSelect extends Component<P, S> {
  readonly state: S = {
    roleList: [],
  };

  componentDidMount() {
    this.getMerchantRoles();
  }

  // 获取角色列表
  getMerchantRoles = async () => {
    this.setState({
      roleList: [],
    });
    try {
      const res = await API.channel.getAllCharacters();
      if (res.code === AJAX_STATUS.SUCCESS) {
        const roleList = res.data;
        this.setState({
          roleList,
        });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  handleRoleChange = (value: number, role) => {
    const { onSubmit } = this.props;
    this.props.onChange(value);
    onSubmit && onSubmit(value, role);
  };

  renderMerchantRoles = () => {
    const { roleList } = this.state;
    return roleList.map((item, index) => {
      return (
        <Option key={index} value={item.id}>
          {item.name}
        </Option>
      );
    });
  };

  render() {
    return (
      <>
        <Select {...this.props} onChange={this.handleRoleChange}>
          {this.renderMerchantRoles()}
        </Select>
      </>
    );
  }
}

export default CustRoleSelect;
