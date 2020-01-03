import { EnvEnum } from './constants';
import React from 'react';
import { Tooltip } from 'antd';
import Regex from '@/shared/common/regex';

export const getEnv = () => {
  const host = window.location.hostname;
  let env = EnvEnum.PROD;
  const is_xmly_domain = ~host.indexOf('.ximalaya.com');

  if (is_xmly_domain) {
    if (~host.indexOf('test')) {
      env = EnvEnum.TEST;
    } else if (~host.indexOf('uat')) {
      env = EnvEnum.UAT;
    } else {
      env = EnvEnum.PROD;
    }
  } else {
    env = EnvEnum.DEV;
  }
  return env;
};

export const formatTimeByTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();
  const min = date.getMinutes();
  const s = date.getSeconds();

  const formatedDate = {
    year: y,
    month: formatTimeUnit(m),
    day: formatTimeUnit(d),
    hour: formatTimeUnit(h),
    min: formatTimeUnit(min),
    seconds: formatTimeUnit(s),
  };

  return formatedDate;
};

export const formatTimeUnit = (unit: number) => {
  return unit < 10 ? '0' + unit : unit;
};

export const getTimestamp = (moment: any) => {
  return Date.parse(moment.format('YYYY-MM-DD HH:mm:ss'));
};

export const getDisplayTime = (time: any) => {
  return `${time.year}-${time.month}-${time.day} ${time.hour}:${time.min}:${time.seconds}`;
};

export const getLocalePrice = (price: string | number) => {

  if (!price) return '无';

  const priceInterval =  price.toString();
  const priceArr = priceInterval.split('~');

  if (priceArr.length === 0) return;
  if (priceArr.length === 1) {
    if (priceArr[0] === '') return '无';
    const price = +priceArr[0];
    return `¥ ${price.toFixed(2).replace(Regex.thounsand, ',')}`;
  } else {
    const startPrice = +priceArr[0];
    const endPrice = +priceArr[1];
    return `¥ ${startPrice.toFixed(2).replace(Regex.thounsand, ',')} ~ 
              ¥ ${endPrice.toFixed(2).replace(Regex.thounsand, ',')}`;
  }
};

export const getCityInfoByCode = (codeStr: string) => {
  if (codeStr === '') return '无';
  if (window.city) {
    const cityInfo = window.city.find(item => {
      return item.code.replace(/\s+/g, '') === codeStr.replace(/\s+/g, '');
    });
    return cityInfo;
  }
};

export const limitWord = (str: string, len: number) => {
  const strLen = str.length;

  return strLen > len ? <Tooltip title={str}>{str.substring(0, len) + '...'}</Tooltip> : str;
};

export const multi = (a, b) => {
  return a * b;
};

declare let window: Window & {
  city: Array<any>;
};
