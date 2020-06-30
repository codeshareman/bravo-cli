export type CitySelectedInfo = {
  selectedDicts: Array<CityInfo>;
};

export type CityInfo = {
  code: string;
  group: string;
  name: string;
  pinyin: string;
};

export enum CitySelectorType {
  SINGLE = 0,
  MULTI = 1
}
