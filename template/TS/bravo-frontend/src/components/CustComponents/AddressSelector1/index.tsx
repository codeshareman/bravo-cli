import React, { FC, useState, forwardRef } from "react";
import { Input } from "antd";
import Selector from "./Selector";

import "./index.scss";

export type IDistrict = {
  code: string;
  name: string;
  provinceCode?: string;
  cityCode?: string;
};

type P = {
  value4Show?: string;
  value: string;
  onChange?(value);
  forwardRef?;
};

const AddressSelector: FC<P> = props => {
  const [showSelector, setShowSelector] = useState(false);
  const [value4Show, setValue4Show] = useState(props.value4Show || ""); //用于展示的值

  const handleChange = (value: string, item: IDistrict, items: IDistrict[]) => {
    const addressNames = items.map(i => i.name).join("/");
    setValue4Show(addressNames);
    props.onChange && props.onChange(value);
    setShowSelector(false);
  };

  return (
    <>
      <Input
        readOnly
        value={value4Show}
        placeholder="请选择收货地址"
        onBlur={() => {
         // setShowSelector(false);
        }}
        onClick={() => {
          setShowSelector(true);
        }}
      />
      <Selector
        style={{ display: showSelector ? "flex" : "none" }}
        onChange={handleChange}
      />
    </>
  );
};

export default forwardRef<P, any>((props, ref) => (
  <AddressSelector options={[]} forwardRef={ref} {...props} />
));

declare let window: Window & { provinceCityDistrict: IDistrict[] };
