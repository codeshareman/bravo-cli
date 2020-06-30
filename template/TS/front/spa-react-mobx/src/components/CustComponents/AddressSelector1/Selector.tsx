import React, { FC, useState, useEffect } from "react";
import { Select, message } from "antd";
import { IDistrict } from "./index";
import Api from "@/api";
import { HTTP_STATUS } from "@/shared/common/constants";

type P = {
  style?: object;
  onChange?(value: string, item: IDistrict, items: IDistrict[]);
};

const Selector: FC<P> = props => {
  const [provincesOptions, setProvincesOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [current, setCurrent] = useState([]); //当前选中的省市，城市，地区信息
  const [tempCurrent, setTempCurrent] = useState([]); //临时存放的省市，城市，地区信息

  useEffect(() => {
    getProvinces();
  }, []);

  const getProvinces = () => {
    Api.contact.provinces().then(r => {
      console.log({ r });
      if (HTTP_STATUS.SUCCESSS === r.code && r.data && r.data.length) {
        setProvincesOptions(r.data || []);
      } else {
        message.error(r.message);
      }
    });
  };

  const findCitiesByProvinceCode = (provinceCode: string, item) => {
    Api.contact.findCitiesByProvinceCode(provinceCode).then(r => {
      console.log({ r });
      if (HTTP_STATUS.SUCCESSS === r.code && r.data && r.data.length) {
        tempCurrent[0] = item;
        setTempCurrent(tempCurrent);
        setCityOptions(r.data || []);
      } else {
        message.error(r.message);
      }
    });
  };

  const findAreasByCityCode = (cityCode: string, item) => {
    Api.contact.findAreasByCityCode(cityCode).then(r => {
      if (HTTP_STATUS.SUCCESSS === r.code && r.data && r.data.length) {
        tempCurrent[1] = item;
        setTempCurrent(tempCurrent);
        setAreaOptions(r.data || []);
      } else {
        message.error(r.message);
      }
    });
  };

  const provincesChange = (value, item) => {
    findCitiesByProvinceCode(value, {
      code: value,
      name: item.props.children
    });
  };

  const citysChange = (value, item) => {
    findAreasByCityCode(value, {
      code: value,
      name: item.props.children
    });
  };

  const areasChange = (value, item) => {
    const it = {
      code: value,
      name: item.props.children
    };
    tempCurrent[2] = it;
    setTempCurrent(tempCurrent);
    setCurrent(tempCurrent);
    props.onChange && props.onChange(value, it, tempCurrent);
  };

  return (
    <div className="address-selector-warp" style={props.style || {}}>
      {provincesOptions && provincesOptions.length ? (
        <Select onChange={provincesChange} placeholder="省">
          {provincesOptions.map(item => (
            <Select.Option key={item.code} value={item.code}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      ) : null}
      {cityOptions && cityOptions.length ? (
        <Select onChange={citysChange} placeholder="市">
          {cityOptions.map(item => (
            <Select.Option key={item.code} value={item.code}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      ) : null}
      {areaOptions && areaOptions.length ? (
        <Select onChange={areasChange} placeholder="区">
          {areaOptions.map(item => (
            <Select.Option key={item.code} value={item.code}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      ) : null}
    </div>
  );
};

export default Selector;
