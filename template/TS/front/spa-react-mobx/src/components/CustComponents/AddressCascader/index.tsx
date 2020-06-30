import React, { FC, useState, useEffect, forwardRef } from "react";
import { Cascader, message } from "antd";
import { CascaderProps } from "antd/lib/cascader";
import { HTTP_STATUS } from "@/shared/common/constants";
import { IDistrict } from "@/api/service/DistrictService";
import Api from "@/api";

type P = CascaderProps & {
  forwardRef?;
};

const AddressCascader: FC<P> = props => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const { provinceCityDistrict } = window;
    if (provinceCityDistrict && provinceCityDistrict.length) {
      setOptions(getDistrict(provinceCityDistrict));
    }
    // Api.district.province().then(r => {
    //   if (HTTP_STATUS.SUCCESSS === r.code) {
    //     const d = getDistrict(r.data, true);
    //     setOptions(d);
    //     if (props.value) {
    //       console.log(props.value, "--加载下级分类--");
    //       getOptionByCode(d ,props.value[0]);
    //     }
    //   } else {
    //     message.error(r.message);
    //   }
    // });
  }, []);

  const loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    try {
      const res = await Api.district.code(targetOption.value);
      targetOption.loading = false;
      if (HTTP_STATUS.SUCCESSS === res.code) {
        const children = getDistrict(res.data.children, true);
        targetOption.children = children;
        setOptions([...options]);
      } else {
        message.error(res.message);
        setOptions([...options]);
      }
    } catch (error) {
      targetOption.loading = false;
      setOptions([...options]);
    }
  };

  // const getOptionByCode = async (d, code) => {
  //   console.log({d})
  //   const targetOption = d.filter(i=> code === i.value)
  //   console.log({targetOption}, "-------getOptionByCode-----")
  //   const res = await Api.district.code(code);
  //   if (HTTP_STATUS.SUCCESSS === res.code) {
  //     const children = getDistrict(res.data.children, true);
  //     targetOption.children = children;
  //     setOptions([{...d, targetOption}]);
  //     console.log({ children });
  //   } else {
  //     message.error(res.message);
  //     // setOptions([...options]);
  //   }
  // };

  const getDistrict = (district: IDistrict[], isProvince?: boolean) => {
    if (!district || !district.length) {
      return [];
    }
    return district.map(item => ({
      value: item.code,
      label: item.label,
      isLeaf: isProvince ? false : !item.children,
      children:
        item.children && item.children.length
          ? getDistrict(item.children)
          : null
    }));
  };
  return (
    <Cascader
      changeOnSelect
      value={props.value}
      options={options}
      loadData={loadData}
      onChange={props.onChange}
    />
  );
};

export default forwardRef<P, any>((props, ref) => (
  <AddressCascader options={[]} forwardRef={ref} {...props} />
));

declare let window: Window & { provinceCityDistrict: IDistrict[] };
