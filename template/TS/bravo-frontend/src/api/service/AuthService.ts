import { AxiosInstance } from "axios";
import { LOGIN_URL } from "../config";

export default class AuthService {
  static readonly SERVER_NAME = "";

  constructor(private readonly http: AxiosInstance) {}

  // 检测登录状态
  async checkLoginState(): Promise<LoginStateResponse> {
    return this.http
      .get(`/web/login/check/${new Date().getTime()}`)
      .then(r => r.data);
  }

  async getUserInfo(): Promise<UserInfoResponse> {
    return this.http.get(`/web/login/user`).then(r => r.data);
  }

  async logout(): Promise<LogoutResponse> {
    return this.http.post(`/web/logout`, {}).then(r => r.data);
  }

  // 跳转到登陆页
  login(fromUri?: string) {
    const uri = fromUri
      ? encodeURIComponent(fromUri)
      : encodeURIComponent(window.location.href);
    window.location.href = LOGIN_URL + `?fromUri=${uri}`;
  }
}

export type LogoutResponse = {
  msg: string;
  ret: number;
};

export type LoginStateResponse = {
  login: boolean;
  msg: string;
  ret: number;
  uid: number;
};

export type UserInfoResponse = {
  /**
   * 请求状态
   */
  ret: number;

  uid: number;

  /**
   * 昵称
   */
  nickname: string;

  /**
   * 昵称是否审核中. true: 审核中
   */
  nicknameInReview: boolean; // 昵称审核中

  /**
   * 邮箱
   */
  email: string;

  /**
   * 带*手机号
   */
  mobile: string;

  /**
   * 手机号是否可以登录
   */
  mobileLoginAble: boolean;

  /**
   * 头像
   */
  logoPic: string;

  /**
   * 是否设置昵称(非默认昵称)
   */
  hadSetNickname: string;

  /**
   * 是否实名认证
   */
  verified: boolean;

  /**
   * 星座
   */
  constellation: string;

  /**
   * 生日 年
   */
  birthYear: number;

  /**
   * 生日 月
   */
  birthMonth: number;

  /**
   * 生日 日
   */
  birthDay: number;

  /**
   * 性别 0:保密 1:男 2:女
   */
  gender: number;

  /**
   * 个性签名
   */
  personalSignature: string;

  /**
   * 个性签名是否审核中. true: 审核中
   */
  personalSignatureInReview: boolean;

  /**
   * 地区-国家
   */
  country: string;

  /**
   * 地区-省
   */
  province: string;

  /**
   * 地区-城市
   */
  city: string;
};
