import config, { noMenuConfig } from "./config";
import { renderRouter, getRouter } from "./utils";

//export const MainRoutes = renderRouter(config);

export const MainRoutes = getRouter(config);

export const noMenuRoutes = getRouter(noMenuConfig);
