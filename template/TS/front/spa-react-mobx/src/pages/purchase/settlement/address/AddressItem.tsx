import React, { FC } from "react";
import { UserContactViewDto } from "@/api/service/ContactService";

type P = {
  children?: React.ReactNode;
  item: UserContactViewDto;
};

const AddressItem: FC<P> = props => {
  let address = "";
  const { item } = props;
  if (item && item.province && item.city && item.area && item.addressLine) {
    address = item.province + item.city + item.area + item.addressLine;
  }
  return (
    <div className="my-address-item">
      <div className="my-address-item-content">
        <span>{item.contactName}</span>
        <span>{address}</span>
        <span>{item.contactPhone}</span>
      </div>
      <div className="my-address-item-extra">
        {props.children && props.children}
      </div>
    </div>
  );
};

export default AddressItem;
