import axios, { AxiosInstance } from "axios";
import { getEnv } from "@/shared/common/utils";
import { systemIdList } from "@/shared/common/constants";
import { AsyncReply } from "../shared/shared";

const env = getEnv();
const systemId = systemIdList[env];

export default class AuthService {
  static readonly SERVER_NAME = "";

  constructor(private readonly http: AxiosInstance) {}
  // 获取一级渠道信息
  getFirstChannel(): AsyncReply<Array<ChannelInfo>> {
    return this.http
      .get(`/anon/channel/get_first_level`, { params: { systemId } })
      .then(r => r.data);
  }

  getKeycloakTicket({ audience, grant_type, token }) {
    return this.http.post(
      "/auth/realms/dev/protocol/openid-connect/token",
      {
        audience,
        grant_type
      },
      {
        headers: {
          Authorization: token
        }
      }
    );
  }
}

export interface ChannelInfo {
  id: number;
  name: string;
  parentId: number;
  fullPath: string;
  status: number;
  remark: string;
  createdBy: string;
}
