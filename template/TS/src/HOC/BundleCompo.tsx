import * as React from "react";

const BundleCompo = function(Compo) {
  return class extends React.PureComponent {
    render() {
      return (
        <React.Suspense fallback={<div />}>
          <Compo />
        </React.Suspense>
      );
    }
  };
};

export default BundleCompo;
