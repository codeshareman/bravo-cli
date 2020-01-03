import axios, { AxiosInstance } from 'axios';
import { getEnv } from '@/shared/common/utils';
import { systemIdList } from '@/shared/common/constants';
import { AsyncReply } from '../shared/shared';

const env = getEnv();
const systemId = systemIdList[env];

export default class AuthService {
  static readonly SERVER_NAME = '';

  constructor(private readonly http: AxiosInstance) {}

  serviceName = '/portal-oss';

  // 获取用户权限
  getUserAuth(): AsyncReply<UserAuthInfo> {
    return this.http
      .get(`${this.serviceName}/user/auth`, { params: { systemId } })
      .then(r => r.data);
  }

  // 获取用户信息
  getUserInfo(): AsyncReply<UserInfo> {
    return this.http
      .get(`${this.serviceName}/user/info`, { params: { systemId } })
      .then(r => r.data);
  }

  // 登出
  logout(): AsyncReply<string> {
    return this.http.get(`${this.serviceName}/logout`, { params: { systemId } }).then(r => r.data);
  }
}

export type AuthMenuInfo = {
  adminFlag: string;
  code: number;
  createdAt: number;
  descInfo: string;
  icon: string;
  level: number;
  name: string;
  parentId: number;
  parentName: string;
  resourceId: number;
  routePath: string;
  sort: number;
  systemId: number;
  type: number;
  updatedAt: number;
};
export interface UserAuthInfo {
  functionList: Array<AuthMenuInfo>;
  isAdmin: boolean;
  menuTree: string;
  roles: Array<any>;
}

export interface UserInfo {
  opsId: number;
  realName: string;
  zhName: string;
  adminFlag: boolean;
}
