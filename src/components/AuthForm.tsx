
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (data: any) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await onSubmit(formData);
      
      toast({
        title: isLogin ? "Welcome back!" : "Account created successfully",
        description: isLogin 
          ? "You've successfully logged in to your account." 
          : "Your account has been created. You can now log in.",
      });
      
      navigate(isLogin ? "/" : "/login");
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: (error as Error).message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/50">
      <div className="w-full max-w-md glass-morphism rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl font-semibold text-center mb-1">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          
          <p className="text-muted-foreground text-center mb-8">
            {isLogin 
              ? "Enter your credentials to access your account" 
              : "Fill in the form below to create your account"
            }
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                className="h-11"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading 
                ? isLogin ? "Logging in..." : "Creating account..." 
                : isLogin ? "Log in" : "Create account"
              }
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <a
                href={isLogin ? "/signup" : "/login"}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Log in"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
