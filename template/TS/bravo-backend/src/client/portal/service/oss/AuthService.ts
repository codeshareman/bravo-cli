import {AxiosInstance} from "axios";
import {AsyncReply} from "../../../shared/shared";

export default class AuthService {

    static readonly SERVICE_NAME = '/portal-oss'

    constructor(private readonly http: AxiosInstance) {
    }


    login() {
        this.http.get(`${AuthService.SERVICE_NAME}/oauth2/authorization/keycloak`)
    }

    userInfo(): AsyncReply<UserInfo> {
        return this.http.get(`${AuthService.SERVICE_NAME}/auth/userInfo`)
            .then(r => r.data)
    }


}

export interface UserInfo {
    userName: string
}