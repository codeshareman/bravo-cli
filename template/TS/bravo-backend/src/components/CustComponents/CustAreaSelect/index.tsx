import React, { Component } from 'react';

import './index.scss';
import CityChoose from '@/components/CityChoose';
import { selectedInfo, selectAreaType } from '@/components/CityChoose/type';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Tag } from 'antd';

type P = {
  form: WrappedFormUtils;
  type?: selectAreaType;
  onChange?: (value: any) => {};
  onSubmit?(): any;
};
type S = {
  visible: boolean;
  selectedArea: Array<any>;
};

// 城市地区选择器
class CustAreaSelect extends Component<P, S> {
  state: S = {
    visible: false,
    selectedArea: [],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.form !== this.props.form) {
      const { form } = nextProps;
      this.setState({
        selectedArea: form.getFieldValue('agencyArea'),
      });
    }
  }

  showAreaCompo = () => {
    this.setState({
      visible: true,
    });
  };

  onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onOk = (info: selectedInfo) => {
    this.props.onChange(info.selectedDicts);
    this.props.onSubmit();
    this.setState({
      visible: false,
      selectedArea: info.selectedDicts,
    });
  };

  onTagClose = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, index: number) => {
    e.preventDefault();
    const { selectedArea } = this.state;

    selectedArea.splice(index, 1);
    this.props.onChange(selectedArea);
    this.props.onSubmit();
    
    this.setState({
      selectedArea,
    });
  };

  renderSelectedArea = () => {
    const { selectedArea } = this.state;
    return (
      selectedArea &&
      selectedArea.map((item, index) => {
        const code = item.code;
        return (
          <Tag
            closable
            key={code}
            onClose={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) =>
              this.onTagClose(e, index)
            }
          >
            {item.name}
          </Tag>
        );
      })
    );
  };

  render() {
    const { selectedArea } = this.state;
    const { type = selectAreaType.MULTI } = this.props;

    return (
      <>
        <div className="selected-list">{this.renderSelectedArea()}</div>
        {selectedArea.length === 0 && (
          <div className="area-choose" onClick={this.showAreaCompo}>
            选择地区
          </div>
        )}
        <CityChoose
          type={type}
          tagData={selectedArea}
          onCancel={this.onCancel}
          onOk={this.onOk}
          visible={this.state.visible}
        />
      </>
    );
  }
}

export default CustAreaSelect;
