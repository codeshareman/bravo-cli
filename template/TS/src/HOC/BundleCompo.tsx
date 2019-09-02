import * as React from "react";
import { Spin } from "antd";

const BundleCompo = function(Compo) {
  return class extends React.PureComponent {
    render() {
      return (
        <React.Suspense
          fallback={
            <div
              style={{
                textAlign: "center",
                padding: "100px 50px",
              }}
            >
              <Spin size="large"/>
            </div>
          }
        >
          <Compo />
        </React.Suspense>
      );
    }
  };
};

export default BundleCompo;
