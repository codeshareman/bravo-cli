import Validator from 'validatorjs'
Validator.useLang('zh')
import regex from './regex'

let message = Validator.getMessages('zh') || {}
//重写错误提示消息
message = {
  accepted: ':attribute必须是可接受的',
  alpha: ':attribute只能包含字母',
  alpha_dash: ':attribute只能包含字母,连字符和下划线',
  alpha_num: ':attribute只能包含字母和数字',
  between: ':attribute的(大小,长度等)只能在:min和:max之间',
  confirmed: ':attribute确认不一致',
  email: ':attribute格式不正确',
  date: ':attribute日期格式错误',
  def: ':attribute属性错误',
  digits: ':attribute必须是:digits位小数',
  different: ':attribute和:different必须不同',
  in: '选择的:attribute无效',
  integer: ':attribute必须是一个整数',
  hex: ':attribute必须为十六精致格式',
  min: {
    numeric: ':attribute不能小于:min',
    string: ':attribute长度不能小于:min',
  },
  max: {
    numeric: ':attribute不能大于:max',
    string: ':attribute长度不能大于:max',
  },
  not_in: '所选的:attribute无效',
  numeric: ':attribute必须是一个数字',
  present: ':attribute必须存在（但可以为空）',
  required: ':attribute不能为空',
  required_if: '当:other是:value时,:attribute不能为空',
  same: ':attribute和:same必须一致',
  size: {
    numeric: ':attribute必须等于:size',
    string: ':attribute的长度必须等于:size',
  },
  string: ':attribute必须是一个字符串',
  url: ':attribute格式不正确',
  regex: ':attribute格式不正确',
  attributes: {},
}

Validator.setMessages('zh', message)

//注册验证规则 格式: Validator.register(name, (value, requirement, attribute) => boolean, errorMessage)
Validator.register('mobile', value => regex.mobile.test(`${value}`), '格式不正确，请输入正确的:attribute')
Validator.register('idCard', value => regex.idCard.test(`${value}`), '格式不正确，请输入正确的:attribute')

/**
 *
 * @param label  标签名称
 * @param value  值
 * @param validator 验证规则
 * @return message  错误消息
 */
const createValidator = (label, value, validator) => {
  const data = { [label]: value }
  const rules = {
    [label]: validator,
  }
  const valid = new Validator(data, rules)
  return valid.passes() ? '' : valid.errors.first(label)
}

/**
 *
 * @param label
 * @param value
 * @param rules
 * @param cb
 * @return callback(message?)
 */
const verify = (label, value, rules, cb) => {
  const error = createValidator(label, value, rules)
  return !error ? cb() : cb(error)
}

export default verify
