import * as React from "react";
import { Switch, Route, Prompt } from "react-router-dom";
import { getPageRoutes } from "../utils/common";

const stepRoutes = getPageRoutes("wws-cli");

/**
 * 用户管理
 */
class MainStage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch>
        {stepRoutes.length &&
          stepRoutes.map(({ path, component }, index) => {
            return (
              <Route exact key={index} path={path} component={component} />
            );
          })}
      </Switch>
    );
  }
}

export default MainStage;
