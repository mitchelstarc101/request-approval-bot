
import React from "react";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";
import LeaveRequestCard from "@/components/LeaveRequestCard";
import { useNavigate } from "react-router-dom";

interface LeaveRequestsSectionProps {
  isLoading: boolean;
  leaveRequests: any[];
  onEdit: (request: any) => void;
  onDelete: (request: any) => void;
  onCreateRequest: () => void;
}

const LeaveRequestsSection: React.FC<LeaveRequestsSectionProps> = ({
  isLoading,
  leaveRequests,
  onEdit,
  onDelete,
  onCreateRequest
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Leave Requests</h2>
        
        <Button 
          variant="outline" 
          onClick={() => navigate("/requests")}
        >
          View All
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="h-64 bg-muted/50 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : leaveRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaveRequests.slice(0, 4).map((request: any) => (
            <LeaveRequestCard
              key={request.id}
              request={request}
              onEdit={
                request.status === "pending" ? () => onEdit(request) : undefined
              }
              onDelete={
                request.status === "pending" ? () => onDelete(request) : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/30">
          <CircleAlert className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No leave requests found</h3>
          <p className="text-muted-foreground mt-1">
            You haven't created any leave requests yet.
          </p>
          <Button className="mt-4" onClick={onCreateRequest}>
            Create Your First Request
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestsSection;
