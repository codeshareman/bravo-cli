import React, { FC } from "react";
import { List } from "antd";
import BoardItem from "./BoardItem";
import { TBoardItem } from "./BoardItem";

import "./index.scss";

type P = {
  dataSource: TBoardItem[];
};

const baseCss = "data-center-income";

const Board: FC<P> = props => (
  <div className={`${baseCss}__board`}>
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 3,
        xxl: 4
      }}
      dataSource={props.dataSource || []}
      renderItem={(item: TBoardItem, index) => (
        <List.Item style={index === 0 ? { paddingRight: 30 } : {}}>
          <BoardItem item={item} />
        </List.Item>
      )}
    />
  </div>
);
export default Board;
