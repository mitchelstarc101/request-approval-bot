
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface RequestInfoProps {
  request: {
    user?: {
      name: string;
      email: string;
    };
    user_name?: string;
    leave_type: string;
    start_date: string | Date;
    end_date: string | Date;
    status: string;
    reason?: string;
  };
}

const RequestInfo: React.FC<RequestInfoProps> = ({ request }) => {
  return (
    <div className="grid gap-2 py-2">
      <div className="grid grid-cols-4 items-center gap-1">
        <span className="text-xs font-medium">Employee:</span>
        <span className="col-span-3 text-xs">{request.user?.name || request.user_name}</span>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-1">
        <span className="text-xs font-medium">Leave Type:</span>
        <span className="col-span-3 text-xs">{request.leave_type}</span>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-1">
        <span className="text-xs font-medium">From:</span>
        <span className="col-span-3 text-xs">{format(new Date(request.start_date), "PPP")}</span>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-1">
        <span className="text-xs font-medium">To:</span>
        <span className="col-span-3 text-xs">{format(new Date(request.end_date), "PPP")}</span>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-1">
        <span className="text-xs font-medium">Status:</span>
        <span className="col-span-3">
          <Badge className={`text-xs py-0 px-2 ${
            request.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
            request.status === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
          }`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </span>
      </div>
      
      <div className="grid grid-cols-4 items-start gap-1">
        <span className="text-xs font-medium">Reason:</span>
        <span className="col-span-3 text-xs">{request.reason || "No reason provided"}</span>
      </div>
    </div>
  );
};

export default RequestInfo;
