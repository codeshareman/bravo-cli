import axios, { AxiosInstance } from 'axios';
import { AsyncReply } from '../../../shared/shared';
import { int64, int32 } from '../../../shared/type';
import { DealStatementResult } from '../provider/AccountService';

export default class AccountService {
  static readonly SERVICE_NAME = 'backend/account';

  constructor(private readonly http: AxiosInstance) {}

  /**
   * 分页查询后台用户
   */
  list(pageNum: int32, pageSize: int32): AsyncReply<Page<BackendAccountVo[]>> {
    return this.http
      .get(`/${AccountService.SERVICE_NAME}/list?pageNum=${pageNum}&pageSize=${pageSize}`)
      .then(r => r.data);
  }

  /**
   * 查询明细
   */
  detail(kcUserId: string): AsyncReply<BackendAccountVo> {
    return this.http.get(`/${AccountService.SERVICE_NAME}/detail/${kcUserId}`).then(r => r.data);
  }

  /**
   * 查询后台角色列表
   */
  roles(): AsyncReply<Role[]> {
    return this.http.get(`/${AccountService.SERVICE_NAME}/roles`).then(r => r.data);
  }

  /**
   * 编辑
   */
  update(req: BackendAccountUpdateReq): AsyncReply {
    return this.http.post(`/${AccountService.SERVICE_NAME}/update`, req).then(r => r.data);
  }

  /**
   * 删除
   */
  del(kcId: string): AsyncReply {
    return this.http.post(`/${AccountService.SERVICE_NAME}/del?kcId=${kcId}`).then(r => r.data);
  }
}

export type Page<T = any> = {
  list: T;
  total: number;
  totalPage: number;
  pageNum: number;
  pageSize: number;
};

export interface Role {
  id: string;
  name: string;
}

export interface BackendAccountVo {
  kcId: string;
  userName: string;
  realName: string;
  roles: string[];
  cities: string[];
  createTime: string;
  updateTime: string;
}

export interface BackendAccountUpdateReq {
  userId: string;
  roles: string[];
}
