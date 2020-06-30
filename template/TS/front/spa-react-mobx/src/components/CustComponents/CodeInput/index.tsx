import React, { FC, useState, forwardRef } from "react";
import { Input, message } from "antd";
import { InputProps } from "antd/lib/input";
import classnames from "classnames";
import Api from "@/api";
import Regex from "@/shared/common/regex";
import { HTTP_STATUS } from "@/shared/common/constants";

import "./index.scss";

export enum CodeType {
  MOBILE,
  EMAIL
}

type P = InputProps & {
  dist: string; //发送目标 , 手机号或者邮箱地址
  suffixtext: string;
  countdown?: number;
  codetype: CodeType;
  forwardedRef?;
};
type S = {
  count: number;
  suffixText: string;
  disabled: boolean;
};
const CodeInput: FC<P> = props => {
  const [disabled, setDisabled] = useState(false);
  const [suffixText, setSuffixText] = useState(
    props.suffixtext || "获取验证码"
  );

  // useEffect(() => {}, []);

  const getCode = () => {
    const { codetype } = props;
    if (disabled) {
      return false;
    } else if (CodeType.EMAIL === codetype) {
      getEmailCode();
    } else {
      getSMSCode();
    }
  };

  //手机号验证码
  const getSMSCode = async () => {
    const { dist } = props;
    if (!dist) {
      message.warning("请输入手机号");
      return false;
    } else if (!Regex.mobile.test(dist.toString())) {
      message.warning("请输入正确的手机号");
      return false;
    }
    try {
      enableSendCode(true);
      const res = await Api.verifyCode.getSmsVerifyCode({
        mobile: dist.toString()
      });
      if (HTTP_STATUS.SUCCESSS === res.code) {
        message.success("验证码发送成功");
        _setSuffixText();
      } else {
        enableSendCode(false);
        message.error(res.message);
      }
    } catch (error) {
      enableSendCode(false);
    }
  };
  //邮箱验证码
  const getEmailCode = async () => {
    const { dist } = props;
    if (!dist) {
      message.warning("请输入邮箱地址");
      return false;
    } else if (!Regex.email.test(dist.toString())) {
      message.warning("请输入正确的邮箱地址");
      return false;
    }
    try {
      enableSendCode(true);
      const res = await Api.verifyCode.getEmailVerifyCode({
        email: dist.toString()
      });
      if (HTTP_STATUS.SUCCESSS === res.code) {
        message.success("验证码已发送, 请登录邮箱获取验证码！");
        _setSuffixText();
      } else {
        enableSendCode(false);
        message.error(res.message);
      }
    } catch (error) {
      enableSendCode(false);
    }
  };

  const _setSuffixText = () => {
    let count = props.countdown || 60;
    setSuffixText(`重新获取(${count}s)`);
    setDisabled(true);
    if (!count) return;
    let intervalId = setInterval(() => {
      if (count > 1) {
        --count;
        setSuffixText(`重新获取(${count}s)`);
      } else {
        clearInterval(intervalId);
        setDisabled(false);
        setSuffixText("重新获取");
      }
    }, 1000);
  };

  const enableSendCode = enable => {
    setDisabled(enable);
    setSuffixText(enable ? "发送中..." : "重新获取");
  };

  const { forwardedRef, ...rest } = props;
  return (
    <Input
      suffix={
        <a
          className={classnames({
            "input-disabled": disabled
          })}
          onClick={() => {
            !disabled && getCode();
          }}
        >
          {suffixText}
        </a>
      }
      {...rest}
    />
  );
};

export default forwardRef<P, any>((props, ref) => (
  <CodeInput forwardedRef={ref} {...props} />
));
