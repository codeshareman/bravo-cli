import React, { Component } from 'react';

import './index.scss';
import API from '@/api';
import Query from './query';
import cx from 'classnames';
import { Table, message, Modal, Form, Input, Switch, Select } from 'antd';
import FormItemDecorator from '@/components/FormItemDecorator';
import { CustBreadcrumb } from '@/components/CustComponents';
import { AJAX_STATUS } from '@/shared/common/constants';
import { getTimestamp, getCityInfoByCode, formatTimeByTimestamp, getLocalePrice } from '@/shared/common/utils';
import regex from '@/shared/common/regex';
import {
  SearchAccountRequest,
  Account,
  AccountRole,
} from '@/client/portal/service/oss/AccountService';
import { FormComponentProps } from 'antd/lib/form';
import { AccountStatus } from './type';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import Search from 'antd/lib/input/Search';
import CustRoleSelect from '@/components/CustComponents/CustRoleSelect';
import GenneralDataCompo from '@/hoc/GenneralDataCompo';

type P = FormComponentProps &
  RouteComponentProps & {
    roleList: Array<any>;
  };
type S = {
  loading: boolean;
  total: number;
  dataSource: Array<any>;
  searchParams: SearchAccountRequest;
  rowData: Account;
  accountStatus: AccountStatus;
  roleModalVisibile: boolean;
  merChantRoles: Array<any>;
};

const { TextArea } = Input;
const { Option } = Select;

// 服务商列表
@(withRouter as any)
class ProvideList extends Component<P, S> {
  state: S = {
    total: 0,
    loading: false,
    rowData: null,
    accountStatus: -1,
    roleModalVisibile: false,
    merChantRoles: [],
    searchParams: {
      companyName: '',
      agentDistrict: '',
      developerId: null,
      contractNo: '',
      startTs: null,
      endTs: null,
      role: null,
      pageNum: 1,
      pageSize: 10,
    },
    dataSource: [],
  };

  componentDidMount() {
    this.initialRequest();
  }

  initialRequest = () => {
    const { searchParams } = this.state;
    this.getMerchantList(searchParams);
  };

  // 获取商户列表
  getMerchantList = async (params: SearchAccountRequest) => {
    this.setState({
      loading: true,
      dataSource: [],
      accountStatus: -1,
    });
    try {
      const res = await API.account.searchAccount(params);
      if (res) {
        if (res.code === AJAX_STATUS.SUCCESS) {
          const resData = res.data;
          this.setState({
            dataSource: resData.list,
            total: resData.total,
            searchParams: {
              ...params,
              pageNum: resData.pageNum,
            },
            loading: false,
          });
        } else {
          message.error(res.message);
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // 禁用
  forbiddenAccount = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          accountStatus: -1,
        });
        const { searchParams, rowData } = this.state;
        const params = {
          uid: rowData.uid,
          reason: values.reason,
        };
        const res = await API.account.disabled(params);

        if (res.code === AJAX_STATUS.SUCCESS) {
          message.success('账号已禁用');
          this.onSubmit(searchParams);
        } else {
          message.error(res.message);
        }
      }
    });
  };

  // 启用
  enableAccount = async () => {
    const { searchParams, rowData } = this.state;
    const uid = rowData.uid;
    const res = await API.account.enable(uid);

    if (res.code === AJAX_STATUS.SUCCESS) {
      message.success('账号已启用');
      this.onSubmit(searchParams);
    } else {
      message.error(res.message);
    }
  };

  // 设置账号状态
  setAccountStatus = (rows: Account) => {
    if (rows.status) {
      this.setState({
        rowData: rows,
        accountStatus: rows.status,
      });
    }
  };

  onCancel = () => {
    this.setState({
      accountStatus: -1,
    });
  };

  onConfirmModifyRole = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          roleModalVisibile: false,
        });
        const { rowData, searchParams } = this.state;
        const params = {
          uid: rowData.uid,
          role: values.role,
        };

        const res = await API.account.modifyRole(params.uid, params.role);
        if (res.code === AJAX_STATUS.SUCCESS) {
          message.success('角色修改成功~');
          // 调用接口
          this.getMerchantList(searchParams);
        } else {
          message.error(res.message);
        }
      }
    });
  };

  onShowRoleModal = (rows: Account) => {
    this.setState({
      rowData: rows,
      roleModalVisibile: true,
    });
  };

  onHideRoleModal = () => {
    this.setState({
      roleModalVisibile: false,
    });
  };

  turnToSpecialPrice = (rows: Account) => {
    this.props.history.push({
      pathname: `/business/provider/specialPrice/${rows.developerId}`,
      state: {
        ...rows,
      },
    });
  };

  onSubmit = values => {
    const { searchParams } = this.state;
    const startTime =
      values.createTime && values.createTime.length > 0 ? getTimestamp(values.createTime[0]) : null;
    const endTime =
      values.createTime && values.createTime.length > 0 ? getTimestamp(values.createTime[1]) : null;
    const agencyAreaCodes = values.agencyArea ? values.agencyArea.map(item => item.code) : [];
    const agencyArea = agencyAreaCodes.length > 0 ? agencyAreaCodes.join(',') : '';

    const params = {
      companyName: values.companyName || '',
      agentDistrict: agencyArea,
      developerId: values.developerId || null,
      contractNo: values.contractNo || '',
      role: values.role,
      startTs: startTime,
      endTs: endTime,
      pageNum: 1,
      pageSize: searchParams.pageSize,
    };

    this.getMerchantList(params);
  };

  getDisplayTime = (time: any) => {
    return `${time.year}-${time.month}-${time.day} ${time.hour}:${time.min}:${time.seconds}`;
  };

  getTableProps = () => {
    const { dataSource } = this.state;
    const columns = [
      {
        key: 'companyName',
        dataIndex: 'companyName',
        title: '公司名称',
        width: 240,
        render: (curVal, row: Account) => {
          return (
            <>
              <p>{row.companyName}</p>
              <p className="sub-info">开发者ID：{row.developerId || '无'}</p>
              <p className="sub-info">推广者ID：{row.spreaderId || '无'}</p>
              <p style={{ marginTop: 6 }}>
                <span
                  className={cx({
                    'account-status': true,
                    'account-enabled': row.status === AccountStatus.NORMAL,
                    'account-disabled': row.status === AccountStatus.DISABLE,
                  })}
                >
                  {row.status === AccountStatus.NORMAL ? '正常' : '停用'}
                </span>
              </p>
            </>
          );
        },
      },
      {
        key: 'agentDistrict',
        dataIndex: 'agentDistrict',
        title: '代理地区',
        width: 100,
        align: 'center',
        render(codeStr: string) {
          const city = getCityInfoByCode(codeStr);
          return city && city.name;
        },
      },
      {
        key: 'role',
        dataIndex: 'role',
        title: '角色',
        width: 120,
        render: (rowId: number) => {
          const { roleList } = this.props;
          const role = roleList.find(item => rowId === item.id);
          return role ? role.name : '';
        },
      },
      {
        key: 'distributor',
        dataIndex: 'distributor',
        title: '是否为分销商',
        width: 120,
        align: 'center',
        render: (distributor: boolean) => {
          return distributor ? '是' : '否';
        },
      },
      {
        key: 'cautionMoney',
        dataIndex: 'cautionMoney',
        title: '保证金金额(元)',
        width: 120,
        align: 'center',
        render(price: string) {
          return price ? getLocalePrice(price) : '无';
        },
      },
      {
        key: 'availableAmount',
        dataIndex: 'availableAmount',
        title: '现金账户可用余额(元)',
        width: 160,
        align: 'center',
        render(price: string) {
          return price ? getLocalePrice(price) : '无';
        },
      },
      {
        key: 'freezeMoney',
        dataIndex: 'freezeMoney',
        title: '冻结金额(元)',
        width: 120,
        align: 'center',
        render(price: string) {
          return price ? getLocalePrice(price) : '无';
        },
      },
      {
        key: 'contractInfo',
        dataIndex: 'contractInfo',
        title: '合同信息',
        width: 250,
        render: (curVal, row: Account) => {
          // const startTime = this.getDisplayTime(formatTimeByTimestamp(row.contractStart));
          // const endTime = this.getDisplayTime(formatTimeByTimestamp(row.contractEnd));
          return (
            <>
              <p>{row.contractNo}</p>
              <p className="sub-info">{row.contractStart}</p>
              <p className="sub-info" style={{ marginBottom: 0 }}>
                {row.contractEnd}
              </p>
            </>
          );
        },
      },
      {
        key: 'updateTime',
        dataIndex: 'updateTime',
        title: '更新/创建时间',
        width: 200,
        render: (curVal, row: Account) => {
          // const startTime = this.getDisplayTime(formatTimeByTimestamp(row.createTime));
          // const endTime = this.getDisplayTime(formatTimeByTimestamp(row.updateTime));
          return (
            <>
              <p>{row.createTime}</p>
              <p style={{ marginBottom: 0 }}>{row.updateTime}</p>
            </>
          );
        },
      },
      {
        key: 'actions',
        dataIndex: 'actions',
        title: '操作',
        width: 100,
        render: (cur, rows: Account) => {
          return (
            <div className="table-actions">
              <a onClick={() => this.setAccountStatus(rows)}>
                {rows.status === AccountStatus.DISABLE ? '启用' : '停用'}
              </a>
              <Link to={`/business/provider/account/${rows.uid}`}>账户明细</Link>
              <a onClick={() => this.turnToSpecialPrice(rows)}>设置特殊价</a>
              <a onClick={() => this.onShowRoleModal(rows)}>修改角色</a>
            </div>
          );
        },
      },
    ];
    return {
      dataSource,
      columns,
      rowKey: 'uid',
    };
  };

  render() {
    const { searchParams, total, accountStatus, roleModalVisibile, rowData } = this.state;
    const routes = [
      { path: '/business/provider', name: '商户管理' },
      { path: '', name: '商户列表' },
    ];
    return (
      <div className="provider-list">
        <CustBreadcrumb routes={routes} showCurrentPosition />
        <Query onSubmit={this.onSubmit} />
        <div className="stastic">
          共 <span className="total"> {total} </span>条数据
        </div>
        <Table
          className="table-list"
          {...this.getTableProps()}
          loading={{ spinning: this.state.loading, tip: '数据加载中...' }}
          scroll={{ x: 1200 }}
          pagination={{
            current: searchParams.pageNum,
            pageSize: searchParams.pageSize,
            total,
            onChange: (page: number) => {
              const params = {
                ...searchParams,
                pageNum: page,
              };
              this.getMerchantList(params);
              this.setState({
                searchParams: params,
              });
            },
          }}
        ></Table>
        <Modal
          visible={accountStatus === AccountStatus.DISABLE}
          title="账号启用"
          onCancel={this.onCancel}
          onOk={this.enableAccount}
          destroyOnClose
        >
          确定启用该服务商账号吗?
        </Modal>
        <Modal
          wrapClassName="account-modal"
          visible={accountStatus === AccountStatus.NORMAL}
          title="账号停用"
          onCancel={this.onCancel}
          onOk={this.forbiddenAccount}
          destroyOnClose
        >
          <Form>
            <FormItemDecorator
              style={{ marginBottom: 0 }}
              form={this.props.form}
              field={'reason'}
              options={{
                rules: [
                  {
                    required: true,
                    message: '账号停用原因不能为空',
                  },
                ],
              }}
            >
              <TextArea
                placeholder="(必填) 请输入账号停用原因"
                autoSize={{ minRows: 5, maxRows: 5 }}
              ></TextArea>
            </FormItemDecorator>
          </Form>
        </Modal>
        <Modal
          title="修改角色"
          visible={roleModalVisibile}
          onOk={this.onConfirmModifyRole}
          onCancel={this.onHideRoleModal}
          destroyOnClose
        >
          <Form layout="inline">
            <FormItemDecorator
              form={this.props.form}
              required
              field="role"
              label="角色"
              options={{
                initialValue: rowData && rowData.role,
                rules: [
                  {
                    required: true,
                    message: '你还未选择角色',
                  },
                ],
              }}
            >
              <CustRoleSelect style={{ width: 200 }} placeholder="请选择角色" allowClear />
            </FormItemDecorator>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create<P>()(GenneralDataCompo(ProvideList));
