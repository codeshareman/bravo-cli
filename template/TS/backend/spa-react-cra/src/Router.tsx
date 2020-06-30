import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

const DefaultLazy = lazy(() => import("components/pages/Default"));

const Router: React.FC = () => {
  return (
    <Suspense fallback={<div>loading</div>}>
      <Switch>
        <Route exact path="/">
          <DefaultLazy></DefaultLazy>
        </Route>
      </Switch>
    </Suspense>
  );
};

export default Router;
