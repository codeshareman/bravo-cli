import React, { Component } from "react";
import cx from "classnames";
import { PageHeader } from "antd";
import { PageHeaderProps } from "antd/lib/page-header";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { getBreadcrumb, renderSelfBreadcrumb } from "@/router";

import "./index.scss";

type P = RouteComponentProps & {
  className?: any;
  pageHeader?: PageHeaderProps & {
    showBreadcrumb?: boolean;
    hidePageHeader?: boolean;
  };
  children: React.ReactNode;
};

type S = {
  //autoBreadcrumb: any
};

class MainContent extends Component<P, S> {
  render() {
    const { className } = this.props;
    //breadcrumb自定义的面包屑
    const { breadcrumb, showBreadcrumb = true, hidePageHeader, ...rest } = this
      .props.pageHeader || {
      title: "",
      breadcrumb: {},
      showBreadcrumb: true,
      hidePageHeader: false
    };
    return (
      <div className={cx("page-container", className)}>
        {this.props.pageHeader && !hidePageHeader ? (
          <PageHeader
            {...rest}
            breadcrumb={
              showBreadcrumb
                ? breadcrumb
                  ? { ...renderSelfBreadcrumb(breadcrumb.routes) }
                  : getBreadcrumb(this.props.match)
                : {}
            }
          />
        ) : null}
        <div className="main-content">{this.props.children}</div>
      </div>
    );
  }
}

export default withRouter(MainContent);
