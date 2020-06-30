import React, { Component } from "react";
import cx from "classnames";

import "./index.scss";
import CityChoose from "@/components/CityChoose";
import { selectedInfo, selectAreaType } from "@/components/CityChoose/type";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { Tag } from "antd";

type P = {
  fieldName?: string;
  fieldType?: string;
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
    selectedArea: []
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { fieldName } = this.props;
    if (nextProps.form !== this.props.form) {
      const { form } = nextProps;
      this.setState({
        selectedArea: form.getFieldValue(fieldName || "agencyArea") || []
      });
    }
  }

  showAreaCompo = () => {
    this.setState({
      visible: true
    });
  };

  onCancel = () => {
    this.setState({
      visible: false
    });
  };

  onOk = (info: selectedInfo) => {
    const { fieldType } = this.props;
    this.props.onChange(info.selectedDicts);
    fieldType !== "box" && this.props.onSubmit();
    this.setState({
      visible: false,
      selectedArea: info.selectedDicts
    });
  };

  onTagClose = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    index: number
  ) => {
    e.stopPropagation();
    const { selectedArea } = this.state;
    const { fieldType } = this.props;

    selectedArea.splice(index, 1);
    this.props.onChange(selectedArea);
    fieldType !== "box" && this.props.onSubmit();

    this.setState({
      selectedArea
    });
  };

  onTagClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>,) => {
    e.stopPropagation();
  } 

  renderSelectedTags = () => {
    const { selectedArea } = this.state;
    return (
      selectedArea &&
      selectedArea.map((item, index) => {
        const code = item.code;
        return (
          <Tag
            closable
            key={code}
            onClick={this.onTagClick}
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

  renderFields = () => {
    const { selectedArea } = this.state;
    const { fieldType } = this.props;
    if (!selectedArea) return null;
    switch (fieldType) {
      case "box":
        return (
          <div
            className={cx({
              "selected-box": fieldType === "box"
            })}
            onClick={this.showAreaCompo}
          >
            {selectedArea.length > 0 ? (
              this.renderSelectedTags()
            ) : (
              <span className="placeholder">请选择负责地区</span>
            )}
          </div>
        );
      default:
        return selectedArea.length > 0 ? (
          <div className="selected-list">{this.renderSelectedTags()}</div>
        ) : (
          <div className="area-choose" onClick={this.showAreaCompo}>
            选择地区
          </div>
        );
    }
  };

  render() {
    const { selectedArea } = this.state;
    const { type = selectAreaType.MULTI } = this.props;

    return (
      <>
        {this.renderFields()}
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
