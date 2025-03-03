
import React from "react";
import { format } from "date-fns";
import { CalendarCheck, Clock, Calendar, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

// Calculate the number of days between two dates
const calculateDuration = (startDate: Date, endDate: Date) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end day
  return diffDays;
};

interface LeaveRequestCardProps {
  request: {
    id: string;
    leave_type: string;
    start_date: string | Date;
    end_date: string | Date;
    status: string;
    reason?: string;
    user?: {
      name: string;
      email: string;
    };
  };
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

const LeaveRequestCard: React.FC<LeaveRequestCardProps> = ({
  request,
  isAdmin = false,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}) => {
  const startDate = new Date(request.start_date);
  const endDate = new Date(request.end_date);
  const duration = calculateDuration(startDate, endDate);
  
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

  const leaveTypeConfig = {
    vacation: {
      label: "Vacation",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
    sick: {
      label: "Sick Leave",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    },
    personal: {
      label: "Personal Leave",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    },
    bereavement: {
      label: "Bereavement",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300",
    },
    study: {
      label: "Study Leave",
      color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    },
    other: {
      label: "Other",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300",
    },
  };

  const status = request.status.toLowerCase() as keyof typeof statusConfig;
  const leaveType = request.leave_type.toLowerCase() as keyof typeof leaveTypeConfig;

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all animate-fadeIn">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge 
              className={cn(
                "mb-2 font-medium", 
                statusConfig[status].color
              )}
            >
              <span className="flex items-center gap-1.5">
                {statusConfig[status].icon}
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </Badge>
            
            <h3 className="text-lg font-medium">{leaveTypeConfig[leaveType].label}</h3>
            
            {isAdmin && request.user && (
              <div className="mt-1 text-sm text-muted-foreground">
                Requested by {request.user.name}
              </div>
            )}
          </div>
          
          <Badge 
            className={cn(
              "px-2.5 py-1 text-xs font-medium",
              leaveTypeConfig[leaveType].color
            )}
          >
            {duration} {duration === 1 ? "day" : "days"}
          </Badge>
        </div>
        
        <div className="grid gap-3">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>From: </span>
            <span className="ml-1 font-medium">{format(startDate, "MMM dd, yyyy")}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <CalendarCheck className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>To: </span>
            <span className="ml-1 font-medium">{format(endDate, "MMM dd, yyyy")}</span>
          </div>
          
          {request.reason && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center text-sm cursor-help">
                  <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="truncate">
                    Reason: {request.reason.length > 30 
                      ? `${request.reason.substring(0, 30)}...` 
                      : request.reason
                    }
                  </span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="font-medium">Reason</div>
                <div className="text-sm mt-1">{request.reason}</div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 px-6 py-4 flex flex-wrap gap-2">
        {request.status === "pending" && (
          <>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                Edit
              </Button>
            )}
            
            {onDelete && (
              <Button variant="outline" size="sm" className="text-destructive" onClick={onDelete}>
                Delete
              </Button>
            )}
            
            {isAdmin && (
              <>
                {onApprove && (
                  <Button size="sm" className="ml-auto gap-1" onClick={onApprove}>
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </Button>
                )}
                
                {onReject && (
                  <Button variant="outline" size="sm" className="text-destructive gap-1" onClick={onReject}>
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default LeaveRequestCard;
