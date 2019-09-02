import * as React from "react";
import { Select } from "antd";

import TopLayout from "../layouts/TopLayout";
import RankLayout from "../layouts/RankLayout";
import CardLayout from "../layouts/CardLayout";
import ChartLayout from "../layouts/ChartLayout";

interface P {}
interface S {}

const Option = Select.Option;

// Big Data Board
class ViewBoard extends React.Component<P, S> {
  setQueryParams = () => {};

  render() {
    return (
      <div>
        <TopLayout />
        <CardLayout />
        <RankLayout />
        <ChartLayout />
      </div>
    );
  }
}

export default ViewBoard;
