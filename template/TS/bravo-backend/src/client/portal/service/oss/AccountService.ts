import axios, { AxiosInstance } from 'axios'
import { AsyncReply, Page } from '../../../shared/shared'
import { int64, int32 } from '../../../shared/type'
import { DealStatementResult } from '../provider/AccountService'

export default class AccountService {
    static readonly SERVICE_NAME = 'account'

    constructor(private readonly http: AxiosInstance) {}

    /**
     * 同意
     */
    accept(input: HandleApprovalRequest): AsyncReply<string> {
        return this.http
            .post(`/${AccountService.SERVICE_NAME}/approval/accept`, input)
            .then(r => r.data)
    }

    /**
     * 拒绝
     */
    reject(input: HandleApprovalRequest): AsyncReply<string> {
        return this.http
            .post(`/${AccountService.SERVICE_NAME}/approval/reject`, input)
            .then(r => r.data)
    }

    /**
     * 搜索入驻申请
     */
    search(input: SearchApprovalRequest): AsyncReply<Page<Approval>> {
        return this.http
            .post(`/${AccountService.SERVICE_NAME}/approval/search`, input)
            .then(r => r.data)
    }

    /**
     * 禁用账户
     */
    disabled(input: DisableRequest): AsyncReply {
        return this.http
            .post(`/${AccountService.SERVICE_NAME}/disabled`, input)
            .then(r => r.data)
    }

    /**
     * 启用账户
     */
    enable(uid: int64): AsyncReply {
        return this.http
            .post(`/${AccountService.SERVICE_NAME}/enable?uid=${uid}`)
            .then(r => r.data)
    }

    /**
     * 分页查询账户
     */
    searchAccount(input: SearchAccountRequest): AsyncReply<Page<Account>> {
        return this.http
            .post(`/${AccountService.SERVICE_NAME}/search`, input)
            .then(r => r.data)
    }

    /**
     * 查询账号明细
     */
    detail(uid: int64): AsyncReply<AccountDetail> {
        return this.http
            .get(`/${AccountService.SERVICE_NAME}/detail/${uid}`)
            .then(r => r.data)
    }

    queryDealStatement(
        request: DealStatementQueryRequest,
    ): AsyncReply<Page<DealStatementResult>> {
        return this.http
            .post(
                `/${AccountService.SERVICE_NAME}/deal/statement/query`,
                request,
            )
            .then(r => r.data)
    }

    /**
     * 变更角色
     */
    modifyRole(uid: int64, role: int32): AsyncReply<Boolean> {
        return this.http
            .post(
                `/${AccountService.SERVICE_NAME}/modifyRole?uid=${uid}&role=${role}`,
            )
            .then(r => r.data)
    }
}

export interface DealStatementQueryRequest {
    tradeTimeStart?: int64
    tradeTimeEnd?: int64
    tradeType?: string
    trxNo?: string
    uid: int64
    pageIndex: int32
    pageSize: int32
}

export interface Account {
    uid: int64
    developerId: int64
    companyName: string
    spreaderId: int64
    agentDistrict: string
    distributor: boolean
    cautionMoney: string
    balance: string
    freezeMoney: string
    contractNo: string
    contractStart: string
    contractEnd: string
    createTime: int64
    updateTime: int64
    status: int32
    role: int32
}

export interface SearchAccountRequest {
    companyName: string
    agentDistrict: string
    developerId: int64
    contractNo: string
    startTs: int64
    endTs: int64
    role: int32
    pageNum: int32
    pageSize: int32
}

export interface DisableRequest {
    uid: int64
    reason: string
}

export interface HandleApprovalRequest {
    id: int64
    approvalId: string
    accountRoleId?: AccountRole
    contractId?: string
    contractStartTime?: int64
    contractEndTime?: int64
    cautionMoney?: string
    remark?: string
}

export interface SearchApprovalRequest {
    companyName?: string
    agencyArea?: string
    status?: int32
    createAtRangeStart?: int64
    createAtRangeEnd?: int64
    pageIndex: int32
    pageSize: int32
}

export interface Approval {
    id: int64
    uid: int64
    companyName: string
    companyHomePage: string
    companyIntro: string
    companyArea: string
    companyAddr: string
    companyBusinessLicense: string
    agencyArea: string
    contactName: string
    contactMobile: string
    contactEmail: string
    status: ApprovalStatus
    approvalId: string
    accountRoleId: AccountRole
    contractId: string
    contractStartTime: int64
    contractEndTime: int64
    cautionMoney: string
    remark: string
    createAt: int64
    updateAt: int64
}

export enum TradeType {
    WITHDRAW = 1, // 撤销
    RECHARGE = 2, // 充值
    TRANSER_IN = 3, //转入
    TRANSER_OUT = 4, // 转出
    DEDUCT = 5, //  扣除
    COMMISSION = 6, // 佣金
    WITHDRAW_FEE = 7, // 免费撤销
    UNKNOWN = 23, //未知
}

export enum ApprovalStatus {
    WAITING_APPROVAL = 100,
    ACCEPTED = 200,
    REJECTED = -100,
}

export enum AccountRole {
    SERVICE_PROVIDER = 1, // "服务商"
    DEALER = 2, // "经销商"
    DIRECT_CUSTOMER = 3, // "直客"
}

export interface AccountDetail {
    // uid
    uid: int64
    // 开发者id
    developerId: int64
    // 公司名称
    companyName: String
    // 推广者id
    spreaderId: int64
    // 代理地区
    agentDistrict: String
    // 是否分销商
    distributor: Boolean
    // 保险金
    cautionMoney: String
    // 余额
    balance: String
    // 冻结金额
    freezeMoney: String
    // 合同编号
    contractNo: String
    // 合同开始时间
    contractStart: String
    // 合同结束时间
    contractEnd: String
    // 创建时间
    createTime: String
    // 修改时间
    updateTime: String
    // 用户状态（1:启用 0:停用）
    status: int32
    // 角色
    role: AccountRole
}
