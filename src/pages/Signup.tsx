
import React from "react";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const { signup } = useAuth();

  return <AuthForm isLogin={false} onSubmit={signup} />;
};

export default Signup;
