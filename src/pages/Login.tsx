
import React from "react";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();

  return <AuthForm isLogin={true} onSubmit={login} />;
};

export default Login;
