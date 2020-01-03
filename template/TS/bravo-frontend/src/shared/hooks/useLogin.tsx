import React, { useState, useEffect } from "react";
import Api from "@/api";
import { HTTP_STATUS } from "../common/constants";
import userStore from "@/models/user";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    console.log({ userStore });
    setLoading(true);
    Api.auth
      .checkLoginState()
      .then(res => {
        setLoading(false);
        setIsLogin(HTTP_STATUS.SUCCESSS === res.ret && res.login);
      })
      .catch(e => {
        setLoading(false);
        setIsLogin(false);
      });
  }, []);

  return [loading, isLogin];
};

export default useLogin;
