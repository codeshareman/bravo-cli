import { AsyncReply, TPage } from './types/shared';
import { AxiosInstance } from 'axios';

class ConfigurationService {
  private http: AxiosInstance;
  static readonly ServiceName = 'configuration';

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  // 分页查询可用jobs列表
  getJobsByPage({ offset, limit }: TPage): AsyncReply<TJobListReply[]> {
    return this.http.get(`${ConfigurationService.ServiceName}/jobs`, { params: { offset, limit } });
  }

  // 查询job总数
  getJobCount(): AsyncReply<number> {
    return this.http.get(`${ConfigurationService.ServiceName}/jobs/count`);
  }

  // 分页查询indicators列表
  getIndicatorsByPage({ offset, limit }: TPage): AsyncReply<TIndicatorListReply[]> {
    return this.http.get(`${ConfigurationService.ServiceName}/indicators`, {
      params: { offset, limit },
    });
  }

  // 查询indicator总数
  getIndicatorCount(): AsyncReply<number> {
    return this.http.get(`${ConfigurationService.ServiceName}/indicators/count`);
  }

  // 删除job
  delJobById(id: number) {
    return this.http.delete(`${ConfigurationService.ServiceName}/jobs/${id}`);
  }

  // 删除指示器
  delIndicatorsById(id: number) {
    return this.http.delete(`${ConfigurationService.ServiceName}/indicators/${id}`);
  }

  // 上传文件
  uploadFile(formData: any): AsyncReply {
    return this.http.post(`${ConfigurationService.ServiceName}`, formData);
  }
}

export type TJobListReply = {
  id: number;
  name: string;
  intervalValue: string;
  modelVersion: string;
  description: string;
  dataSource: {
    kind: 'http' | 'https';
  };
  storage: {
    target: string;
  };
};

export type TIndicatorListReply = {
  id: number;
  chineseName: string;
  cronExpression: string;
  intervalValue: string;
  kind: string;
  labelColumns: string[];
  modelVersion: string;
  name: string;
  sql: string;
  timestamp: string;
  triggerMode: string;
  sourceType: 'internal' | 'kafka' | 'http';
};

export default ConfigurationService;
