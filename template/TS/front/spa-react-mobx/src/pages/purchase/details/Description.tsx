import React, { FC } from "react";

import {
  Product,
  ProductIntroduction,
  ContentType
} from "@/api/service/ProductService";

type P = {
  product: Product;
};

const Description: FC<P> = props => {
  const items = props.product ? props.product.productIntroductions : null;
  console.log(items, "----")
  return (
    <div className="product-description">
      {items && items.length
        ? items.map((i, index) => <DescriptionItem key={index} item={i} />)
        : null}
    </div>
  );
};

type DescriptionItemProps = {
  item: ProductIntroduction;
};

const DescriptionItem: FC<DescriptionItemProps> = props => {
  if (!props.item) {
    return null;
  } else if (ContentType.TEXT === props.item.contentType) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: props.item.content ? props.item.content : ""
        }}
      ></div>
    );
  } else if (ContentType.IMAGE === props.item.contentType) {
    return props.item.content ? <img src={props.item.content} alt="" /> : null;
  } else if (ContentType.VIDEO === props.item.contentType) {
    <video src={props.item.content} autoPlay={false} />;
  } else {
    return null;
  }
};

export default Description;
