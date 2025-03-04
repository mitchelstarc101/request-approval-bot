
import React, { useState } from "react";
import { format } from "date-fns";
import { AlertCircle, CalendarCheck, Calendar, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Comment } from "@/services/leaveRequestService";

interface LeaveRequestDetailProps {
  request: {
    id: string;
    user_name: string;
    leave_type: string;
    start_date: string | Date;
    end_date: string | Date;
    status: string;
    reason?: string;
    comments?: Comment[];
    created_at: string;
    updated_at: string;
  };
  isAdmin?: boolean;
  onApprove?: (comment: string) => void;
  onReject?: (comment: string) => void;
  onAddComment?: (comment: string) => void;
  onClose?: () => void;
}

const LeaveRequestDetail: React.FC<LeaveRequestDetailProps> = ({
  request,
  isAdmin = false,
  onApprove,
  onReject,
  onAddComment,
  onClose,
}) => {
  const [comment, setComment] = useState("");
  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    },
    approved: {
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    },
    rejected: {
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
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
  const startDate = new Date(request.start_date);
  const endDate = new Date(request.end_date);
  
  const handleSubmitComment = () => {
    if (comment.trim()) {
      onAddComment?.(comment);
      setComment("");
    }
  };
  
  const handleApprove = () => {
    if (onApprove) {
      onApprove(comment);
      setComment("");
    }
  };
  
  const handleReject = () => {
    if (onReject) {
      onReject(comment);
      setComment("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Leave Request Details</h2>
          <p className="text-muted-foreground">
            Created on {format(new Date(request.created_at), "MMMM dd, yyyy")}
          </p>
        </div>
        
        <Badge 
          className={cn(
            "px-3 py-1 text-sm font-medium", 
            statusConfig[status].color
          )}
        >
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </Badge>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Request Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Leave Type</h3>
                <Badge 
                  className={cn(
                    "mt-1 px-2.5 py-0.5", 
                    leaveTypeConfig[leaveType].color
                  )}
                >
                  {leaveTypeConfig[leaveType].label}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Employee</h3>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p>{request.user_name}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p>{format(startDate, "MMMM dd, yyyy")}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                  <p>{format(endDate, "MMMM dd, yyyy")}</p>
                </div>
              </div>
            </div>
          </div>
          
          {request.reason && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Reason</h3>
              <div className="flex items-start gap-2 mt-1">
                <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm">{request.reason}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {request.comments && request.comments.length > 0 ? (
            <div className="space-y-4">
              {request.comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-muted/40 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">{comment.user_name}</p>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), "MMM dd, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No comments yet</p>
          )}
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <Separator />
          <Textarea 
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-2 justify-end w-full">
            {request.status === "pending" && isAdmin && (
              <>
                <Button 
                  variant="outline" 
                  className="text-destructive" 
                  onClick={handleReject}
                >
                  Reject with Comment
                </Button>
                <Button 
                  onClick={handleApprove}
                >
                  Approve with Comment
                </Button>
              </>
            )}
            {onAddComment && (
              <Button
                variant="secondary"
                onClick={handleSubmitComment}
                disabled={!comment.trim()}
              >
                Add Comment
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default LeaveRequestDetail;
