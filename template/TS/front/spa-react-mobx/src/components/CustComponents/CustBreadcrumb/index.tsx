import React, { FC } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Breadcrumb } from "antd";
import { getBreadcrumbRoutes } from "@/router/utils";
import arrowRight from "@/assets/images/ico_arrow@2x.png";

import "./index.scss";

type P = RouteComponentProps & {
  className?: string;
  style?: object;
  showCurrentPosition?: boolean;
  routes?: {
    path?: string;
    name: string;
  }[];
};

const { Separator, Item } = Breadcrumb;

const CustBreadcrumb: FC<P> = props => {
  const path = props.match.path || props.location.pathname;
  //默认路由
  const _defaultRoutes = getBreadcrumbRoutes(path);
  const {
    routes = _defaultRoutes,
    style = {},
    className = "",
    showCurrentPosition
  } = props;
  if (!routes.length) return null;

  return (
    <Breadcrumb
      style={style}
      className={`cust-breadcrumb ${className}`}
      separator=""
    >
      {//显示当前位置
      showCurrentPosition && <Item key="ci">当前位置</Item>}
      {showCurrentPosition && <Separator key="cs">:</Separator>}

      {routes.map((item, index) => {
        const children = [];
        if (index !== 0) {
          children.push(
            <Separator key={"separator_" + index}>
              <img className="cust-separator" src={arrowRight} alt="分隔符" />
            </Separator>
          );
        }
        //最后一个不能点击
        children.push(
          <Item
            key={"item_" + index}
            onClick={() => {
              if (index !== routes.length - 1 && item.path) {
                props.history.push(item.path);
              }
            }}
          >
            {index !== routes.length - 1 ? <a>{item.name}</a> : item.name}
          </Item>
        );
        return children;
      })}
    </Breadcrumb>
  );
};

export default withRouter(CustBreadcrumb);
