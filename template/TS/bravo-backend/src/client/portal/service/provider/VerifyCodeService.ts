import {AxiosInstance} from "axios";
import {Reply} from "../../../shared/shared";


export default class VerifyCodeService {

    constructor(private readonly http: AxiosInstance) {
    }

    /**
     * 获取邮件验证码
     * @param params
     */
    getEmailVerifyCode(params: Required<{ email: string }>): Promise<Reply<string>> {
        return this.http.get(`verify/code/email`, {params}).then(r => r.data)
    }

    /**
     * 获取短信验证码
     * @param params
     */
    getSmsVerifyCode(params: Required<{ mobile: string }>): Promise<Reply<string>> {
        return this.http.get(`verify/code/sms`, {params}).then(r => r.data)
    }

}