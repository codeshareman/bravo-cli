import axios, { AxiosInstance } from "axios";
import { AsyncReply } from "../shared";

export default class DistrictService {
  static readonly SERVICE_NAME = "portal-provider/district";

  constructor(private readonly http: AxiosInstance) {}

  /**
   * 获取省的信息
   */
  province(): AsyncReply<IDistrict[]> {
    return this.http
      .get(`/${DistrictService.SERVICE_NAME}/province`)
      .then(r => r.data);
  }

  //根据code获取下级信息
  code(code: string): AsyncReply<IDistrict> {
    return this.http
      .get(`/${DistrictService.SERVICE_NAME}/code/${code}`)
      .then(r => r.data);
  }

  //根据label 获取code
  label(label: string): AsyncReply<IDistrict> {
    return this.http
      .get(
        `/${DistrictService.SERVICE_NAME}/label/${encodeURIComponent(label)}`
      )
      .then(r => r.data);
  }
}

export type IDistrict = {
  code: string;
  label: string;
  children: IDistrict[];
};
