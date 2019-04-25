import Validator from "validatorjs";
Validator.useLang("zh");
import regex from "./regex";

//注册验证规则 格式: Validator.register(name, (value, requirement, attribute) => boolean, errorMessage)

Validator.register(
  "mobile",
  value => value.match(regex.mobile),
  "格式不正确，请输入正确的:attribute"
);
Validator.register(
  "idCard",
  value => value.match(regex.idCard),
  "格式不正确，请输入正确的:attribute"
);

/**
 *
 * @param label  标签名称
 * @param value  值
 * @param validator 验证规则
 * @return message  错误消息
 */
const createValidator = (label, value, validator) => {
  const data = { [label]: value };
  const rules = {
    [label]: validator
  };
  let valid = new Validator(data, rules);
  return valid.passes() ? "" : valid.errors.first(label);
};

/**
 *
 * @param label
 * @param value
 * @param rules
 * @param cb
 * @return callback(message?)
 */
const verify = (label, value, rules, cb) => {
  const error = createValidator(label, value, rules);
  return !error ? cb() : cb(error);
};

export default verify;
