import axios, { AxiosInstance } from "axios";
import { getEnv } from "@/shared/common/utils";
import { systemIdList } from "@/shared/common/constants";
import qs from "querystring";
import { AsyncReply } from "../shared/shared";

const env = getEnv();
const systemId = systemIdList[env];

export default class KeycloakService {
  static readonly SERVER_NAME = "";

  constructor(private readonly http: AxiosInstance) {}

  getKeycloakTicket({ audience, grant_type, token }) {
    const data = {
      audience,
      grant_type
    };
    return this.http.post(
      "/auth/realms/dev/protocol/openid-connect/token",
      qs.stringify(data),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          authorization: token
        }
      }
    );
  }
}
