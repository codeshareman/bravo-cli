import React, { FC, useState, useEffect, forwardRef } from "react";
import { Input, Icon } from "antd";
import Selector from "./Selector";
import { CitySelectorType, CitySelectedInfo } from "./type";
import { getDictInfoByCode } from "./utils";

import "./index.scss";

type P = {
  type?: CitySelectorType;
  value?: any;
  onChange?(value);
  forwardRef?: any;
};

const CitySelector: FC<P> = props => {
  const [visible, setVisible] = useState(false);
  const [valueName, setValueName] = useState("");

  useEffect(() => {
    getNamesByCode();
  }, [
    props.value,
    () => {
      console.log(props.value, "********");
    }
  ]);

  const getNamesByCode = () => {
    const { value, type } = props;
    if (CitySelectorType.SINGLE === type) {
      const info = getDictInfoByCode(value);
      info && setValueName(info.name);
    } else if (value && value instanceof Array && value.length) {
      let names = [];
      value.forEach(i => {
        const info = getDictInfoByCode(i);
        info && names.push(info.name);
      });
      setValueName(names.toString());
    }
  };

  const hadnleOk = (selected: CitySelectedInfo) => {
    const { type = CitySelectorType.SINGLE } = props;
    const { selectedDicts } = selected;
    let value = null,
      name = "";
    if (selectedDicts && selectedDicts.length) {
      if (CitySelectorType.SINGLE === type) {
        value = selectedDicts[0].code;
        name = selectedDicts[0].name;
      } else {
        value = [];
        let names = [];
        selectedDicts.forEach(item => {
          value.push(item.code);
          names.push(item.name);
        });
        name = names.toString();
      }
    }
    props.onChange(value);
    setValueName(name);
    toggleVisible();
  };

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const { value, type = CitySelectorType.SINGLE } = props;

  return (
    <div className="city-selector">
      <Input
        readOnly
        value={valueName}
        onClick={toggleVisible}
        suffix={
          <Icon
            type="down"
            style={{ color: "#BEBEBE" }}
            onClick={toggleVisible}
          />
        }
      />
      <Selector
        type={type}
        visible={visible}
        defaultValue={value}
        onCancel={toggleVisible}
        onOk={hadnleOk}
      />
    </div>
  );
};

export default forwardRef<any, P>((props, ref) => (
  <CitySelector forwardRef={ref} {...props} />
));
