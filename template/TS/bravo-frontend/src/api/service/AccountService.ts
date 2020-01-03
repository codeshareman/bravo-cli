import { AxiosInstance } from "axios";
import { AsyncReply, Page } from "../shared";
import { int64, int32 } from "../type";

export default class AccountService {
  static readonly SERVICE_NAME = "portal-provider/account";

  constructor(private readonly http: AxiosInstance) {}

  /**
   * 查询用户状态
   */
  status(): AsyncReply<AccountStatusDTO> {
    return this.http
      .get(`/${AccountService.SERVICE_NAME}/status`)
      .then(r => r.data);
  }

  /**
   * 查询喜马用户基本信息(头像、昵称)
   */
  basicInfo(): AsyncReply<BasicUserInfo> {
    return this.http
      .get(`/${AccountService.SERVICE_NAME}/basic`)
      .then(r => r.data);
  }

  /**
   * 查询商户权限列表
   */
  perms(): AsyncReply<string[]> {
    return this.http
      .get(`/${AccountService.SERVICE_NAME}/perm`)
      .then(r => r.data);
  }

  /**
   * 查询开发者账号信息
   */
  developerInfo(): AsyncReply<DeveloperAccount> {
    return this.http
      .get(`/${AccountService.SERVICE_NAME}/developer`)
      .then(r => r.data);
  }

  /**
   * 查询账号明细
   */
  detail(): AsyncReply<AccountDetail> {
    return this.http
      .get(`/${AccountService.SERVICE_NAME}/detail`)
      .then(r => r.data);
  }

  /**
   * 提交账号申请
   * @param request
   */
  apply(request: AccountApplyRequest): AsyncReply<any> {
    return this.http
      .post(`/${AccountService.SERVICE_NAME}/create`, request)
      .then(r => r.data);
  }

  /**
   * 获取提交信息
   * @param request
   */
  applyInfo(): AsyncReply<AccountApplyInfo> {
    return this.http
      .get(`/${AccountService.SERVICE_NAME}/applyInfo`)
      .then(r => r.data);
  }

  /**
   * 验证公司名称是否已经存在
   * @param request
   */
  verifyCompanyName(request: VerifyCompanyNameRequest): AsyncReply<boolean> {
    return this.http
      .post(`/${AccountService.SERVICE_NAME}/verify/company/name`, request)
      .then(r => r.data);
  }

  queryDealStatement(
    request: DealStatementQueryRequest
  ): AsyncReply<Page<DealStatementResult>> {
    return this.http
      .post(`/${AccountService.SERVICE_NAME}/deal/statement/query`, request)
      .then(r => r.data);
  }
}

export interface DealStatementResult {
  trxNo: string;
  income: string;
  expense: string;
  balance: string;
  tradeType: TradeType;
  remark: string;
  tradeTime: int64;
}

export enum TradeType {
  WITHDRAW = 1, // 撤销
  RECHARGE = 2, // 充值
  TRANSER_IN = 3, //转入
  TRANSER_OUT = 4, // 转出
  DEDUCT = 5, //  扣除
  COMMISSION = 6, // 佣金
  WITHDRAW_FEE = 7, // 免费撤销
  UNKNOWN = 23 //未知
}

export interface DealStatementQueryRequest {
  tradeTimeStart?: int64;
  tradeTimeEnd?: int64;
  tradeType?: string;
  trxNo?: string;
  pageIndex: int32;
  pageSize: int32;
}

export interface AccountStatusDTO {
  accountStatus: AccountStatus;
  extra: Extra;
}

export const enum AccountStatus {
  DISABLE = 0, // "停用"
  NORMAL = 1, // "启用"
  WAITING_APPROVAL = 2, // "审核中"
  APPROVAL_REJECT = 3, // "审核失败"
  NON_DEVELOPER = 4, // "未注册开发者账号"
  NON_CSP = 5, // "已成为开发者账号，未入驻城市服务商"
  UNKNOWN = 99 // "未知状态"
}

export interface Extra {
  // 公司名称
  companyName: string;
  // 审批拒绝原因
  approvalRejectReason: string;
}

export interface BasicUserInfo {
  // 头像
  logoPic: string;
  // 喜马昵称
  nickname: string;
  uid: number;
  ptitle: string;
  personDescribe: string;
  country: string;
  province: string;
  city: string;
  personalSignature: string;
  hasLive: boolean;
  errorMsg: string;
  errorCode: string;
  success: true;
  vipExpireTime: number;
  nicknameModifyAvailableCount: number;
  anchorGrade: number;
  userGrade: number;
  userTitle: string;
  robot: string;
  vip: string;
  loginBan: string;
  vcategoryId: string;
  verified: string;
}

export interface DeveloperAccount {
  id: string;
  uid: string;
  registerInfo: {
    // 公司名称
    companyName: string;
    // 公司主页
    companyUrl: string;
    // 公司简介
    companyDesc: string;
    // 公司地址
    address: string;
    // 详细地址
    companyAddr: string;
    // 营业执照
    businessLicenseUrl: string;
    // 联系人
    name: string;
    // 手机号
    mobile: string;
    // 邮箱
    email: string;

    desc: string;

    devIdCardNo: any;

    developerType: string;

    idCardNoUrl: string;

    sysName: string;

    userId: number;
  };
  extraInfo: {
    auditFailReason: string;
    businessTypeCategoryId: number;
    closeReason: string;
    closedAt: number;
    closedBy: string;
    createSource: string;
    createdAt: number;
    developerIntro: string;
    hardwareAppNum: number;
    mobileAppNum: number;
    rewardTypesCode: string;
    updatedAt: number;
    webAppNum: number;
  };
}

export interface AccountDetail {
  // uid
  uid: int64;
  // 开发者id
  developerId: int64;
  // 公司名称
  companyName: String;
  // 推广者id
  spreaderId: int64;
  // 代理地区
  agentDistrict: string;
  // 是否分销商
  distributor: boolean;
  // 保险金
  cautionMoney: string;
  // 余额
  balance: string;
  // 冻结金额
  freezeMoney: string;
  // 合同编号
  contractNo: string;
  // 合同开始时间
  contractStart: string;
  // 合同结束时间
  contractEnd: string;
  // 创建时间
  createTime: string;
  // 修改时间
  updateTime: string;
  // 用户状态（1:启用 0:停用）
  status: int32;
  // 角色
  role: AccountRole;
  // 可用余额
  availableAmount: string;
}

export const enum AccountRole {
  SERVICE_PROVIDER = 1, // "服务商"
  DEALER = 2, // "经销商"
  DIRECT_CUSTOMER = 3 // "直客"
}

export interface AccountApplyRequest {
  developerId?: number | string;
  // uid
  uid: int64;
  // 公司名称
  companyName: string;
  // 公司主页
  companyHomePage: string;
  // 公司简介
  companyIntro: string;
  /** 公司所在地区*/
  companyArea: string;
  // 公司地址
  companyAddr: string;
  // 营业执照
  companyBusinessLicense: string;
  // 代理地区
  agencyArea: any;
  // 联系人
  contactName: string;
  // 手机号
  contactMobile: string;
  // 邮箱
  contactEmail: string;
  // 手机验证码
  contactMobileVerifyCode: string;
  // 邮箱验证码
  contactEmailVerifyCode: string;
}

export interface AccountApplyInfo {
  /** 公司所在地区*/
  companyArea: string;
  agencyArea: string;
  approvalId: string;
  cautionMoney: string;
  companyAddr: string;
  companyBusinessLicense: string;
  companyHomePage: string;
  companyIntro: string;
  companyName: string;
  contactEmail: string;
  contactMobile: string;
  contactName: string;
  contractEndTime: number;
  contractId: string;
  contractStartTime: number;
  createAt: number;
  id: int32;
  merchantTypeId: number;
  remark: string;
  status: ApprovalStatus;
  uid: number;
  updateAt: number;
}

export const enum ApprovalStatus {
  WAITING_APPROVAL = 100, //待审核
  ACCEPTED = 200, //审核已通过
  REJECTED = -100 //审核未通过
}

export interface VerifyCompanyNameRequest {
  developerId?: int64;
  companyName: string;
}
