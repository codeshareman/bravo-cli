import React, { FunctionComponent } from "react";
import { Icon } from "antd";

import "./index.scss";

type P = {
  title: string;
};

const Title: FunctionComponent<P> = props => (
  <p className="data-center-section__title">
    <Icon type="caret-right" />
    <strong>{props.title}</strong>
  </p>
);

export default Title;
