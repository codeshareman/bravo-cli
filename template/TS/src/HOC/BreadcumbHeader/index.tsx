import * as React from "react";
import { Breadcrumb, Button } from "antd";
import { Link, RouteComponentProps } from "react-router-dom";
import { FormComponentProps } from "antd/lib/form";

// 本地文件
import "./index.scss";
import { APP_CONFIG } from "../../utils/constant";

type PathParamsType = {
  id: string;
};

type ParentProps = RouteComponentProps<PathParamsType> & FormComponentProps;

type RoutesDataType = {
  path?: string;
  name: string;
};

type ButtonType = {
  type: string;
  name: string;
};

interface HeaderConfigs {
  pageTitle: string;
  breadcumbs?: RoutesDataType[];
  buttonGroup?: ButtonType[];
}

interface IProps extends ParentProps {}

interface IState {}

//  全局导航
const BreadcumbHeader = (headerConfig: HeaderConfigs) => {
  return function(WrappedComponent: any) {
    return class extends React.Component<IProps, IState> {
      pageRef: {
        handleExit?: Function;
        handleSave?: Function;
        handlePublish?: Function;
      };

      constructor(props: IProps) {
        super(props);
      }

      renderBreadcumbItem = () => {
        return (
          headerConfig.breadcumbs &&
          headerConfig.breadcumbs.map((item, index) => {
            let BreadcumbItem = null;
            if (index === headerConfig.breadcumbs.length - 1) {
              BreadcumbItem = (
                <Breadcrumb.Item key={index} separator="">
                  {item.name}
                </Breadcrumb.Item>
              );
            } else {
              const linkUrl = `${APP_CONFIG.baseRouteName}${item.path}`;
              BreadcumbItem = (
                <Breadcrumb.Item key={index}>
                  <Link to={linkUrl}>{item.name}</Link>
                </Breadcrumb.Item>
              );
            }
            return BreadcumbItem;
          })
        );
      };

      renderBtnGroup = () => {
        return (
          headerConfig.buttonGroup &&
          headerConfig.buttonGroup.map((item, index) => {
            let buttonFunc = null;
            switch (item.type) {
              case "exit":
                return (
                  <Button
                    key={index}
                    className={`global-${item.type}`}
                    onClick={() => this.pageRef.handleSave()}
                  >
                    {item.name}
                  </Button>
                );
              case "save":
                return (
                  <Button
                    key={index}
                    className={`global-${item.type} voi_default_normal`}
                    onClick={e => this.pageRef.handleSave(e)}
                  >
                    {item.name}
                  </Button>
                );
              case "publish":
                return (
                  <Button
                    key={index}
                    className={`global-${item.type} voi_primary_normal `}
                    onClick={() => this.pageRef.handleSave()}
                  >
                    {item.name}
                  </Button>
                );
            }
          })
        );
      };

      render() {
        return (
          <div className="page-wrapper">
            <div className="global-header">
              <div>
                <Breadcrumb>{this.renderBreadcumbItem()}</Breadcrumb>
                <p className="page-title">{headerConfig.pageTitle}</p>
              </div>
              <div className="renderBtnGroup">{this.renderBtnGroup()}</div>
            </div>
            <WrappedComponent
              ref={(node: any) => (this.pageRef = node)}
              {...this.props}
            />
          </div>
        );
      }
    };
  };
};

export default BreadcumbHeader;
