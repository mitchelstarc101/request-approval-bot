
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">TimeOff</span>
        </div>
        
        <div className="flex space-x-4">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Log in
          </Button>
          <Button onClick={() => navigate("/signup")}>
            Sign up
          </Button>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl space-y-6 animate-fadeIn">
          <div className="text-sm font-medium text-primary py-1 px-3 rounded-full bg-primary/10 inline-block mb-2">
            Simple Leave Management Solution
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
            Simplify your company's
            <span className="text-primary block mt-2">leave request process</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A beautiful, intuitive platform for employees to request time off
            and for managers to approve requests with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="h-12 px-8 text-base"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 px-8 text-base"
              onClick={() => navigate("/login")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Streamlined Leave Management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage employee time off in one beautiful, easy-to-use platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Request Submission",
                description: "Employees can easily submit leave requests with just a few clicks.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                    <path d="m9 16 2 2 4-4" />
                  </svg>
                ),
              },
              {
                title: "Quick Approval Process",
                description: "Managers can approve or reject requests with a single click.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                ),
              },
              {
                title: "Comprehensive Dashboard",
                description: "Get a clear overview of all leave requests and their statuses.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-morphism p-6 rounded-xl animate-fadeIn"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto glass-morphism rounded-2xl p-8 md:p-12 text-center animate-fadeIn">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Ready to transform your leave management?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of companies that use TimeOff to streamline their leave request process.
          </p>
          <Button 
            size="lg" 
            className="h-12 px-8 text-base"
            onClick={() => navigate("/signup")}
          >
            Get Started Now
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-medium">TimeOff</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TimeOff. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
