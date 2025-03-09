
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DashboardHeaderProps {
  userName: string | undefined;
  onNewRequest: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  userName, 
  onNewRequest 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {userName || "User"}
        </p>
      </div>
      
      <Button 
        size="lg" 
        className="flex items-center gap-2"
        onClick={onNewRequest}
      >
        <PlusCircle size={18} />
        New Leave Request
      </Button>
    </div>
  );
};

export default DashboardHeader;
