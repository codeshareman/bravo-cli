import React from "react";

import { Switch } from "react-router-dom";
import { APP_CONFIG, IS_LOGIN } from "@/utils/constant";
import { routes } from "@/router";
import { Plugins } from "@xmly/voi";
// const { Plugins } = window.Voi;

import { LocalMenu, ScreenLayout } from "@/layout";

const { registerName } = APP_CONFIG;
const { BaseEffect } = Plugins;

type P = {
  isLocal: boolean;
};
const PageLayout = (props: P) => {
  const { isLocal } = props;
  if (!IS_LOGIN) {
    return !isLocal ? (
      <LocalMenu />
    ) : (
      <BaseEffect appName={registerName}>
        <Switch>{routes}</Switch>
      </BaseEffect>
    );
  } else {
    return <ScreenLayout />;
  }
};

declare let window: Window & {
  voi: any;
  Voi: any;
};

export default PageLayout;
