import { YearMonth } from "client/service/RevenueService";

export type FilterParams = {
  businessType: number;
  params: YearMonth & {
    pageIndex?: number;
    pageSize?: number;
  };
};

export enum TabKey {
  AGENT = 1,
  MINE = 2
}
