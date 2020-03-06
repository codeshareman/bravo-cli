// 权益类型
export const RIGHT_TYPE = [
    { value: 'GIFT', label: '一键领取礼包' },
    { value: 'MULTI_GIFT', label: '多选一礼包' },
    { value: 'VIP', label: '体验会员' },
    { value: 'XXM_VIP', label: '小喜马' },
]
export const RIGHT_TYPE_DICT = {
    accept: 'GIFT',
    many: 'MULTI_GIFT',
    try: 'VIP',
    small: 'XXM_VIP'
}
// 商户列表账户状态
export const ACCOUNT_STATUS = [
    { value:0, label:'停用' },
    { value:1, label:'正常' }
]
export const ACCOUNT_STATUS_DICT = {
    stop: 0,
    normal: 1
}
// 奖励账户状态
export const AWARD_STATUS = [
    { value:0, label:'已关闭' },
    { value:1, label:'已开通' }
]
export const AWARD_STATUS_DICT = {
    stop: 0,
    normal: 1
}