import { AxiosInstance } from 'axios';
import { AsyncReply } from '../../../shared/shared';

export default class AuthService {
  static readonly SERVICE_NAME = '/portal-oss';

  constructor(private readonly http: AxiosInstance) {}

  login() {
    this.http.get(`${AuthService.SERVICE_NAME}/oauth2/authorization/keycloak`);
  }

  userInfo(): AsyncReply<UserInfo> {
    return this.http
      .get(`${AuthService.SERVICE_NAME}/profile/personal-info/basic`)
      .then(r => r.data);
  }

  logoutLocal() {
    return this.http.post(`${AuthService.SERVICE_NAME}/logout`).then(r => r.data);
  }

  logoutKeyCloak(redirect_uri: string) {
    return this.http
      .get(`/auth/realms/master/protocol/openid-connect/logout`, { params: redirect_uri })
      .then(r => r.data);
  }

  permissionList(): AsyncReply<Array<string>> {
    return this.http.get(`${AuthService.SERVICE_NAME}/auth/permission/list`).then(r => r.data);
  }
}

export interface UserInfo {
  userName: string;
}
