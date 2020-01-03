import React, { Component } from "react";
import { Modal, Radio, Form, Button, message, Icon, Popconfirm } from "antd";
import AddressItem from "./AddressItem";
import EditAddress from "./EditAddress";
import { UserContactViewDto } from "@/api/service/ContactService";
import { HTTP_STATUS } from "@/shared/common/constants";
import Api from "@/api";

import "./index.scss";

type P = {
  onChange?(item: UserContactViewDto);
};
type S = {
  selectDefault: boolean;
  visibleEditModal: boolean;
  value: number;
  addressList: UserContactViewDto[];
  defaultAddress: UserContactViewDto;
  modalTitle: string;
  editEntity: UserContactViewDto;
};

class Address extends Component<P, S> {
  state = {
    value: 1,
    selectDefault: false,
    visibleEditModal: false,
    addressList: [],
    defaultAddress: null,
    modalTitle: "新增收货地址",
    editEntity: null
  };

  componentDidMount() {
    this.getAddress();
  }

  getAddress = async () => {
    const res = await Api.contact.all();
    console.log({ res });
    if (HTTP_STATUS.SUCCESSS === res.code) {
      const addressList: UserContactViewDto[] = res.data || [];
      let defaultAddress: UserContactViewDto = null;
      if (addressList && addressList.length) {
        for (let i = 0; i < addressList.length; i++) {
          if (addressList[i].defaultAddress) {
            defaultAddress = addressList[i];
            break;
          }
        }
      }
      this.setState({ addressList, defaultAddress }, () => {
        const { onChange } = this.props;
        onChange && onChange(defaultAddress);
      });
    } else {
      message.error(res.message);
    }
  };

  onChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  remove = async (item: UserContactViewDto) => {
    if (!item || !item.usrContactId) {
      return false;
    }
    const res = await Api.contact.remove(item.usrContactId);
    if (HTTP_STATUS.SUCCESSS !== res.code) {
      message.error(res.message);
      return false;
    }
    message.success("删除成功");
    //如果删除的是默认地址
    if (item.defaultAddress) {
      this.setState({
        defaultAddress: null
      });
    }
    this.getAddress();
  };

  handleEdit = item => {
    console.log({ item });
    this.setState({
      modalTitle: "编辑收获地址",
      visibleEditModal: true,
      editEntity: item
    });
  };

  setDefaultAddress = async () => {
    const { value } = this.state;
    console.log({ value });
    const res = await Api.contact.setDefault(value);
    if (HTTP_STATUS.SUCCESSS === res.code) {
      message.success("默认地址设置成功");
      this.getAddress();
      this.setState({
        selectDefault: false
      });
    } else {
      message.error(res.message);
    }
  };
  //新增收获地址
  addAddress = () => {
    console.log("--新增收获地址--");
    this.setState({
      modalTitle: "新增收获地址",
      visibleEditModal: true,
      editEntity: null
    });
  };

  toggleSelectDefault = () => {
    const { selectDefault } = this.state;
    this.setState({
      selectDefault: !selectDefault
    });
  };

  toggleVisibleEditModal = (isAdd?: boolean) => {
    const { visibleEditModal } = this.state;
    this.setState({
      visibleEditModal: !visibleEditModal,
      modalTitle: isAdd ? "新增收货地址" : "编辑收货地址"
    });
  };

  cancelSelect = () => {
    const { defaultAddress } = this.state;
    if (!defaultAddress) {
      message.warn("请设置默认收获地址");
    } else {
      //重新获取地址
      this.getAddress();
      this.setState({
        selectDefault: false
      });
    }
  };

  handleSubmit = async values => {
    if (!values.areaCode) {
      delete values.areaCode;
    }
    if (values.usrContactId) {
      const res = await Api.contact.update(values);
      if (HTTP_STATUS.SUCCESSS === res.code) {
        message.success("保存成功");
        this.setState({
          visibleEditModal: false,
          selectDefault: false
        });
        this.getAddress();
      } else {
        message.error(res.message);
      }
    } else {
      const res = await Api.contact.add(values);
      if (HTTP_STATUS.SUCCESSS === res.code) {
        message.success("保存成功");
        this.setState({
          visibleEditModal: false,
          selectDefault: false
        });
        this.getAddress();
      } else {
        message.error(res.message);
      }
    }
  };

  renderSelectDefault = () => {
    const { addressList, defaultAddress } = this.state;

    if (!addressList || !addressList.length) {
      return null;
    }

    return (
      <Form className="my-address-select-default">
        <Radio.Group
          onChange={this.onChange}
          defaultValue={defaultAddress ? defaultAddress.usrContactId : null}
        >
          {addressList.map(item => (
            <Radio key={item.usrContactId} value={item.usrContactId}>
              <AddressItem item={item}>
                <a
                  onClick={() => {
                    this.handleEdit(item);
                  }}
                >
                  修改
                </a>

                <Popconfirm
                  title="确定要删除当前地址?"
                  onConfirm={() => {
                    this.remove(item);
                  }}
                >
                  <a>删除</a>
                </Popconfirm>
              </AddressItem>
            </Radio>
          ))}
        </Radio.Group>
        <Form.Item>
          <a className="add-address" onClick={this.addAddress}>
            <Icon type="plus" />
            新增收货地址
          </a>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={this.setDefaultAddress}>
            使用当前地址
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={this.cancelSelect}>
            取消
          </Button>
        </Form.Item>
      </Form>
    );
  };

  render() {
    const {
      visibleEditModal,
      selectDefault,
      addressList,
      defaultAddress,
      modalTitle,
      editEntity
    } = this.state;
    return (
      <div className="my-address">
        {addressList && addressList.length ? (
          selectDefault ? (
            this.renderSelectDefault()
          ) : defaultAddress ? (
            <div className="defalut-address">
              <AddressItem
                key={defaultAddress.usrContactId}
                item={defaultAddress}
              >
                <a
                  onClick={() => {
                    this.handleEdit(defaultAddress);
                  }}
                >
                  修改
                </a>
                <a onClick={this.toggleSelectDefault}>更改</a>
                <a onClick={this.addAddress}>使用新地址</a>
              </AddressItem>
            </div>
          ) : (
            <a onClick={this.toggleSelectDefault}>选择地址</a>
          )
        ) : (
          <a
            style={{ fontSize: 14, paddingLeft: 50 }}
            onClick={this.addAddress}
          >
            添加新地址
          </a>
        )}

        <Modal
          destroyOnClose
          title={modalTitle}
          visible={visibleEditModal}
          footer={null}
          onCancel={() => {
            this.toggleVisibleEditModal();
          }}
        >
          <EditAddress item={editEntity} onSubmit={this.handleSubmit} />
        </Modal>
      </div>
    );
  }
}

export default Address;
