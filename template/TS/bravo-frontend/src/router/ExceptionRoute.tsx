import React, { FC } from "react";
import { Route } from "react-router-dom";
import Page403 from "@/pages/exception/403";
import Page404 from "@/pages/exception/404";

type P = {};

const ExceptionRoute: FC<P> = props => {
  
  return (
    <>
      <Route exect path="/exception/403" component={Page403} />
      <Route exect component={Page404} />
    </>
  );
};

export default ExceptionRoute;
