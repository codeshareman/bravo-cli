import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const stepRoutes = getSecondLevelMenu("step_form");

@connect(
  state => {},
  dispatch => {}
)
class ProfitCenter extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentWillReceiveProps(prevProps, nextProps) {}

  componentDidMount() {
  }

  componentWillUpdate() {}

  shouldComponentUpdate() {}

  render() {
    return (
      stepRoutes.length &&
      stepRoutes.map(({ path, component }, index) => {
        return <Route key={index} path={path} component={component} />;
      })
    );
  }
}

export default withRouter(ProfitCenter);
