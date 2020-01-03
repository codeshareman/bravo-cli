import React, { Component } from 'react';
import API from '@/api';
import { AJAX_STATUS } from '@/shared/common/constants';
import { message } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

type P = RouteComponentProps<{ uid: string }> & {};
type S = {
  roleList: Array<any>;
};

// 全局数据组件
function GenneralDataCompo(Compo: any) {
  return class GenneralDataCompo extends Component<P, S> {
    state: S = {
      roleList: [],
    };

    componentDidMount() {
      this.getRoleList();
    }

    getCurrentRole = (id: number) => {
      const { roleList } = this.state;
      const role = roleList.find(item => id === item.id);
      return role ? role.name : '';
    };

    // 获取角色列表
    getRoleList = async () => {
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

    render() {
      const { roleList } = this.state;
      return <Compo {...this.props} roleList={roleList} />;
    }
  };
}

export default GenneralDataCompo;
