import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Divider, Table, message, Form, Input } from 'antd';
import cx from 'classnames';

import './index.scss';
import API from '@/api';

import Query from './query';
import { CustBreadcrumb } from '@/components/CustComponents';
import PriceSetModal from '@/components/PriceSetModal';
import PriceModal from '@/components/PriceModal';
import {
  ProductQueryRequest,
  ChannelProduct,
  SavePriceRequest,
  Character,
} from '@/client/portal/service/oss/ChannelStrategyService';
import { AJAX_STATUS } from '@/shared/common/constants';
import { limitWord, formatTimeByTimestamp, getLocalePrice } from '@/shared/common/utils';
import Regex from '@/shared/common/regex';
import { TableActionType } from './type';
import { UserActionType } from '@/components/PriceSetModal/type';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { PriceModalType } from '@/components/PriceModal/type';
import { EditType } from '@/pages/merchant/provider/price_add/list/type';
import { FormComponentProps } from 'antd/lib/form';
import FormItemDecorator from '@/components/FormItemDecorator';

type P = FormComponentProps & RouteComponentProps<{ roleId: string }> & {};
type S = {
  dataSource: Array<any>;
  loading: boolean;
  visible: boolean;
  total: number;
  roleList: Array<any>;
  currentRole: Character;
  actionType: TableActionType;
  searchParams: ProductQueryRequest;
  productDetail: Array<ChannelProduct>;
  curRows: any;
  editType: EditType;
  nextIndex: number;
};

@(withRouter as any)
class PriceSetting extends Component<P, S> {
  state: S = {
    loading: true,
    dataSource: [],
    visible: false,
    total: 0,
    currentRole: null,
    roleList: [],
    actionType: TableActionType.DEFAULT,
    productDetail: [],
    editType: null,
    curRows: null,
    nextIndex: 0,
    searchParams: {
      pageIndex: 1,
      pageSize: 10,
      characterId: null,
      productId: null,
    },
  };

  componentDidMount() {
    this.initialRequest();
  }

  initialRequest = () => {
    const {
      match: { params },
    } = this.props;

    const searchParams = {
      ...this.state.searchParams,
      characterId: +params.roleId,
    };

    this.getChannelPriceList(searchParams);
    this.getMerchantRoles();
  };

  onSubmit = (params: ProductQueryRequest) => {
    this.getChannelPriceList(params);
  };

  // 过滤数据源
  filterDataSource = tableList => {
    tableList = tableList || this.state.dataSource;
    return tableList.map((rows: any) => {
      return {
        ...rows,
        id: rows.productId ? rows.productId : rows.itemId,
        items: rows.items && rows.items.length > 0 ? this.filterDataSource(rows.items) : [],
      };
    });
  };

  // 获取渠道价格列表
  getChannelPriceList = async (params: any) => {
    this.setState({
      loading: true,
      dataSource: [],
    });
    try {
      const res = await API.channel.queryProducts(params);
      if (res.code === AJAX_STATUS.SUCCESS) {
        const dataSource = res.data.data;
        const current = res.data.current;
        const total = res.data.total;
        this.setState({
          total,
          loading: false,
          dataSource: this.filterDataSource(dataSource),
          searchParams: {
            ...params,
            pageIndex: current,
          },
        });
      } else {
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // 获取角色列表
  getMerchantRoles = async () => {
    const {
      match: { params },
    } = this.props;
    const curRoleId = params.roleId;
    try {
      const res = await API.channel.getAllCharacters();
      if (res.code === AJAX_STATUS.SUCCESS) {
        const roleList = res.data;
        const currentRole = roleList.find(item => item.id === ~~curRoleId);
        this.setState({
          roleList,
          currentRole,
        });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  setChannelStrategies = async (params: SavePriceRequest) => {
    const { searchParams } = this.state;
    const res = await API.channel.createChannelStrategies(params);
    if (res.code === AJAX_STATUS.SUCCESS) {
      message.success('渠道价盘设置成功');
      this.getChannelPriceList(searchParams);
      this.setState({
        actionType: TableActionType.DEFAULT,
        editType: null,
      });
    } else {
      message.error(res.message);
    }
  };

  setActionTypeAndInfo = (type: TableActionType, info: ChannelProduct) => {
    const skuList = info.items.map((item, index) => {
      return {
        ...item,
        index,
      };
    });
    const productDetail = [
      {
        ...info,
        items: skuList,
      },
    ];
    const newSkuList = productDetail[0].items;

    this.setState({
      productDetail,
      actionType: type,
      curRows: newSkuList[0],
      editType: EditType.CHANNEL,
    });
  };

  setCurrentRole = (role: Character) => {
    this.setState({
      currentRole: role,
    });
  };

  updateDataSource = (type: UserActionType) => {
    let { productDetail } = this.state;
    const curDataSource = productDetail.slice(0);

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const newDataSource = curDataSource.map(rows => {
          const skuList = rows.items;
          return {
            ...rows,
            items: skuList.map((sku, index) => {
              const fields = Object.keys(values).filter(item => ~item.indexOf(`channelPrice`));
              const matchStr = `channelPrice-${sku.itemId}`;
              if (~fields.indexOf(matchStr)) {
                const index = fields.indexOf(matchStr);
                const key = fields[index];
                sku.channelPrice = values[key];
              }
              return sku;
            }),
          };
        });
        if (type === UserActionType.BTN_CONFIRM) {
          const savePriceParams = this.getSavePriceParams(newDataSource);
          this.setChannelStrategies(savePriceParams[0]);
        }
      }
    });
  };

  getSavePriceParams = dataSource => {
    const { currentRole } = this.state;
    return dataSource.map(rows => {
      if (rows.productId) {
        return {
          productId: rows.productId,
          characterId: currentRole.id,
          items: rows.items.length > 0 ? this.getSavePriceParams(rows.items) : [],
        };
      }
      if (rows.itemId) {
        return {
          itemId: rows.itemId,
          channelPrice: rows.channelPrice,
        };
      }
    });
  };

  updatePriceNoClose = () => {
    this.updateDataSource(UserActionType.KEY_ENTER);
    const { productDetail } = this.state;
    const skuList = productDetail[0].items;
    const nextIndex = this.state.nextIndex < skuList.length - 1 ? ++this.state.nextIndex : 0;

    this.setState({
      curRows: skuList[nextIndex],
      nextIndex,
    });
  };

  handlePriceSet = (rows: any, type: EditType) => {
    this.updatePriceNoClose();
    this.setState({
      curRows: rows,
      editType: type,
    });
  };

  onConfirm = () => {
    this.updateDataSource(UserActionType.BTN_CONFIRM);
  };

  onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      actionType: TableActionType.DEFAULT,
      editType: null,
    });
  };

  // 验证价盘价字段
  validateChannelPrice = (rules: any, channelpPrice: any, callback: any, rows: any) => {
    if (~~rows.price < ~~channelpPrice) {
      callback('价盘价不能大于原价哦');
    } else {
      callback();
    }
  };

  getTableProps = () => {
    const { dataSource, currentRole } = this.state;
    const columns = [
      {
        title: '商品信息',
        dataIndex: 'productInfo',
        key: 'productInfo',
        width: 350,
        render: (info, rows: ChannelProduct) => {
          return (
            <div className="product">
              <div className="cover">
                <img src={rows.coverPath} />
              </div>
              <div className="info">
                <p className="product-name">商品名称：{limitWord(rows.productName, 18)}</p>
                <p className="product-id">商品编号：{limitWord(rows.productId.toString(), 16)}</p>
              </div>
            </div>
          );
        },
      },
      {
        title: '原价',
        dataIndex: 'price',
        key: 'price',
        width: 250,
        render: (price: string) => {
          return `¥ ${price.replace(Regex.thounsand, ',')}`;
        },
      },
      {
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
        width: 220,
        render: () => {
          return currentRole ? currentRole.name : '';
        },
      },
      {
        title: '渠道价',
        dataIndex: 'channelPrice',
        key: 'channelPrice',
        width: 250,
        render: (price: string) => {
          return `¥ ${price.replace(Regex.thounsand, ',')}`;
        },
      },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        render: (val, info: ChannelProduct) => {
          return (
            <>
              <a
                style={{ marginRight: 10 }}
                onClick={() => this.setActionTypeAndInfo(TableActionType.EDIT, info)}
              >
                设置
              </a>
              <a onClick={() => this.setActionTypeAndInfo(TableActionType.VIEW, info)}>查看</a>
            </>
          );
        },
      },
    ];
    return { dataSource, columns, rowKey: 'productId' };
  };

  getTableColumns = () => {
    const columns = [
      {
        title: '商品',
        dataIndex: 'productInfo',
        key: 'productInfo',
      },
      {
        title: '原价',
        dataIndex: 'price',
        key: 'price',
        render: (curVal: string, rows: any, index) => {
          return getLocalePrice(curVal);
        },
      },
      {
        title: '价盘价',
        dataIndex: 'channelPrice',
        key: 'channelPrice',
        render: (price: string, rows: any, index: number) => {
          const { curRows, editType, actionType } = this.state;
          const autoFocus = curRows ? curRows.id === rows.id : true;

          const isEdit =
            curRows &&
            curRows.id === rows.id &&
            editType === EditType.CHANNEL &&
            actionType === TableActionType.EDIT;

          return !isEdit ? (
            <div
              className={cx({
                'price-text': actionType === TableActionType.EDIT,
              })}
            >
              <span onClick={() => this.handlePriceSet(rows, EditType.CHANNEL)}>
                {getLocalePrice(price)}
              </span>
            </div>
          ) : (
            <FormItemDecorator
              form={this.props.form}
              label=""
              field={`channelPrice-${rows.id}`}
              options={{
                initialValue: price,
                rules: [
                  {
                    required: true,
                    message: '你还未输入价盘价',
                  },
                  {
                    pattern: Regex.money,
                    message: '价盘价格式不正确',
                  },
                ],
              }}
            >
              <Input
                style={{ width: '90%' }}
                addonBefore={'¥'}
                // onBlur={this.updatePriceNoClose}
                onFocus={() => {
                  this.setState({
                    curRows: rows,
                    nextIndex: rows.index,
                  });
                }}
                onPressEnter={this.updatePriceNoClose}
                autoFocus={autoFocus}
              />
            </FormItemDecorator>
          );
        },
      },
    ];
    return columns;
  };

  render() {
    const { roleList, loading, actionType, currentRole, total, searchParams } = this.state;
    const routes = [
      { path: '', name: '商户管理' },
      { path: '/business/role', name: '商户角色' },
      { path: '', name: '设置价盘' },
    ];
    return (
      <div className="channel-price">
        <CustBreadcrumb routes={routes} showCurrentPosition />
        <Query
          onSubmit={this.onSubmit}
          onSetCurrentRole={this.setCurrentRole}
          roleList={roleList}
          currentRole={currentRole}
        />
        <Divider />
        <Table
          {...this.getTableProps()}
          loading={{ spinning: loading, tip: '数据加载中...' }}
          className="table-list"
          // rowSelection={{
          //   type: 'checkbox',
          // }}
          pagination={{
            total,
            current: searchParams.pageIndex,
            pageSize: searchParams.pageSize,
            onChange: pageIndex => {
              const searchParams = {
                ...this.state.searchParams,
                pageIndex,
              };
              this.getChannelPriceList(searchParams);
              this.setState({
                searchParams,
              });
            },
          }}
        />
        <PriceModal
          title="查看商品"
          type={PriceModalType.CHANNEL}
          currentRole={currentRole}
          columns={this.getTableColumns()}
          dataSource={this.state.productDetail}
          visible={actionType === TableActionType.VIEW}
          onCancel={this.onCancel}
          destroyOnClose
        />
        <PriceSetModal
          title="设置"
          type={PriceModalType.CHANNEL}
          currentRole={currentRole}
          dataSource={this.state.productDetail}
          columns={this.getTableColumns()}
          visible={actionType === TableActionType.EDIT}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          destroyOnClose
        />
      </div>
    );
  }
}

export default Form.create()(PriceSetting);
