
import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      icon: <Clock className="h-4 w-4" />,
    },
    approved: {
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    rejected: {
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      icon: <XCircle className="h-4 w-4" />,
    },
  };

  const normalizedStatus = status.toLowerCase() as keyof typeof statusConfig;
  
  return (
    <Badge 
      className={cn(
        "mb-2 font-medium", 
        statusConfig[normalizedStatus].color
      )}
    >
      <span className="flex items-center gap-1.5">
        {statusConfig[normalizedStatus].icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </Badge>
  );
};

export default StatusBadge;
