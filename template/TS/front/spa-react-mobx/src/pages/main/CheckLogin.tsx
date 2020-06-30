import React, { useEffect } from "react";
import { useLogin } from "@/shared/hooks";

const CheckLogin = props => {
  const [loading, isLogin] = useLogin();

  useEffect(() => {
    console.log({ loading, isLogin });
  },[loading]);

  return <div>登录状态检查</div>;
};

export default CheckLogin;
