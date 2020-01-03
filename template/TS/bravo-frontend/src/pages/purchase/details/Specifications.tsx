import React, { FC } from "react";
import { Typography, Empty } from "antd";
const { Paragraph, Text, Title } = Typography;

import { Product } from "@/api/service/ProductService";

type P = {
  product: Product;
};
const Specifications: FC<P> = props => (
  <div className="details-specifications">
    暂无规格数据
    {/* <Paragraph>
      <Title level={4}>产品名称：</Title>
      <Text>小雅AI音响</Text>
    </Paragraph> */}
    {/* <Paragraph>
      <Title level={4}>产品型号：</Title>
      <Text>AI-001</Text>
    </Paragraph>
    <Paragraph>
      <Title level={4}>颜色：</Title>
      <Text>红色、黑色、灰色</Text>
    </Paragraph>
    <Paragraph>
      <Title level={4}>材质：</Title>
      <Text>塑料</Text>
    </Paragraph>
    <Paragraph>
      <Title level={4}>重量：</Title>
      <Text>2.51kg</Text>
    </Paragraph>
    <Paragraph>
      <Title level={4}>音箱控制：</Title>
      <Text>手动</Text>
    </Paragraph>
    <Paragraph>
      <Title level={4}>尺寸：</Title>
      <Text>120*264mm</Text>
    </Paragraph>
    <Paragraph>
      <Title level={4}>声道：</Title>
      <Text>2.0</Text>
    </Paragraph> */}
  </div>
);

export default Specifications;
