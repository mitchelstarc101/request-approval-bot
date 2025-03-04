
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/services";

const ForgotPasswordForm = ({ onBackToLogin }: { onBackToLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await authService.resetPassword(email);
      setIsSubmitted(true);
      
      toast({
        title: "Password reset email sent",
        description: "If an account exists with this email, you will receive reset instructions.",
      });
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
          <button
            onClick={onBackToLogin}
            className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </button>
          
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl font-semibold text-center mb-1">
            {isSubmitted ? "Check your email" : "Forgot password"}
          </h1>
          
          <p className="text-muted-foreground text-center mb-8">
            {isSubmitted 
              ? "We've sent recovery instructions to your email"
              : "Enter your email address and we'll send you recovery instructions"
            }
          </p>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          ) : (
            <Button 
              onClick={onBackToLogin}
              className="w-full h-11 text-base font-medium"
            >
              Back to login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
