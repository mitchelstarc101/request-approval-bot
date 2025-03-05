
import React from "react";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();

  const handleLogin = async (credentials: any) => {
    try {
      console.log("Attempting to log in with:", credentials.email);
      await login(credentials);
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw to let AuthForm handle the error
    }
  };

  return <AuthForm isLogin={true} onSubmit={handleLogin} />;
};

export default Login;
