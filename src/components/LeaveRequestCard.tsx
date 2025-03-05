
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import StatusBadge from "./leave-request/StatusBadge";
import LeaveTypeBadge from "./leave-request/LeaveTypeBadge";
import DateRangeInfo from "./leave-request/DateRangeInfo";
import ReasonDisplay from "./leave-request/ReasonDisplay";
import CardActions from "./leave-request/CardActions";
import { calculateDuration } from "./leave-request/utils";

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
  
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all animate-fadeIn">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <StatusBadge status={request.status} />
            
            <LeaveTypeBadge leaveType={request.leave_type} />
            
            {isAdmin && request.user && (
              <div className="mt-1 text-sm text-muted-foreground">
                Requested by {request.user.name}
              </div>
            )}
          </div>
          
          <LeaveTypeBadge 
            leaveType={request.leave_type} 
            duration={duration} 
            showDuration={true} 
          />
        </div>
        
        <div className="grid gap-3">
          <DateRangeInfo startDate={startDate} endDate={endDate} />
          <ReasonDisplay reason={request.reason} />
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 px-6 py-4 flex flex-wrap gap-2">
        <CardActions 
          status={request.status}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
          onApprove={onApprove}
          onReject={onReject}
        />
      </CardFooter>
    </Card>
  );
};

export default LeaveRequestCard;
