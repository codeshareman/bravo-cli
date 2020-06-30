import { AxiosInstance } from "axios";
import { AsyncReply } from "../shared";

export default class VerifyCodeService {
  static readonly SERVICE_NAME = "portal-provider";
  constructor(private readonly http: AxiosInstance) {}

  getEmailVerifyCode(params: Required<{ email: string }>): AsyncReply<string> {
    return this.http.get(`/${VerifyCodeService.SERVICE_NAME}/verify/code/email`, { params }).then(r => r.data);
  }

  getSmsVerifyCode(params: Required<{ mobile: string }>): AsyncReply<string> {
    return this.http.get(`/${VerifyCodeService.SERVICE_NAME}/verify/code/sms`, { params }).then(r => r.data);
  }
}
