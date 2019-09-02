import React, { FunctionComponent } from "react";
import { Icon, Tooltip } from "antd";

export type TBoardItem = {
  title: string;
  content: string | number;
  tips?: string;
};

type P = {
  item: TBoardItem;
};

const baseCss = "data-center-income";

const BoardItem: FunctionComponent<P> = props => (
  <div className={`${baseCss}__board-item`}>
    <div className={`${baseCss}__board-item-title`}>
      <h4>{props.item.title}</h4>
      {props.item.tips ? (
        <section>
          <Tooltip title={props.item.tips}>
            <Icon type="info-circle" theme="filled" />
          </Tooltip>
        </section>
      ) : null}
    </div>
    <p>{props.item.content}</p>
  </div>
);

export default BoardItem;
