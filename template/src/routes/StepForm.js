import React, { Component } from "react";
import { Route, withRouter, Redirect } from "react-router-dom";
import { Spin } from "antd";
import Loadable from "react-loadable";
import { getSecondLevelMenu } from "@/utils/common";

const stepRoutes = getSecondLevelMenu('step_form');

class StepForm extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log(this.props);
  }
  render() {
    const {
      match: { params }
    } = this.props;
    const nextStep = params.step;
    const currentStep = 1;
    if (nextStep > currentStep) {
      return <Redirect to={`/wws-b/v2/broccoli/step/${currentStep}`} />;
    } else {
      return (
        stepRoutes.length &&
        stepRoutes.map(({ path, component }, index) => {
          return <Route key={index} path={path} component={component} />;
        })
      );
    }
  }
}

export default withRouter(StepForm);
