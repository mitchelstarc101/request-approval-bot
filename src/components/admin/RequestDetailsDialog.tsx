import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { leaveRequestService, type Comment } from "@/services";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { calculateDuration } from "@/utils";

interface RequestDetailsDialogProps {
  request: {
    id: string;
    status: string;
    user?: {
      name: string;
      email: string;
    };
    user_name?: string;
    leave_type: string;
    start_date: string | Date;
    end_date: string | Date;
    reason?: string;
    comments?: Comment[];
  } | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({
  request,
  isOpen,
  onOpenChange,
}) => {
  const [commentText, setCommentText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  const approveMutation = useMutation({
    mutationFn: (id: string) => leaveRequestService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLeaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["leaveReport"] });
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
      
      toast({
        title: "Request Approved",
        description: "The leave request has been approved successfully",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve the request",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => leaveRequestService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLeaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["leaveReport"] });
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
      
      toast({
        title: "Request Rejected",
        description: "The leave request has been rejected",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject the request",
        variant: "destructive",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ leaveId, text }: { leaveId: string; text: string }) => 
      leaveRequestService.addComment(leaveId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLeaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
      
      setCommentText("");
      toast({
        title: "Comment Added",
        description: "Your comment has been added to the request",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    if (request) {
      approveMutation.mutate(request.id);
    }
  };

  const handleReject = () => {
    if (request) {
      rejectMutation.mutate(request.id);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !commentText.trim()) return;
    
    commentMutation.mutate({
      leaveId: request.id,
      text: commentText
    });
  };

  const renderAdminOverride = () => {
    if (!isAdmin || !request) return null;
    
    const duration = calculateDuration(new Date(request.start_date), new Date(request.end_date));
    const isOverLimit = 
      (request.leave_type === "personal" && duration > 12) ||
      (request.leave_type === "sick" && duration > 6);
    
    if (isOverLimit) {
      return (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            This request exceeds standard leave limits. As an admin, you can override these limits.
          </p>
        </div>
      );
    }
    
    return null;
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base">Leave Request Details</DialogTitle>
        </DialogHeader>
        
        {renderAdminOverride()}
        
        <RequestInfo request={request} />
        
        {request.comments && request.comments.length > 0 && (
          <CommentsSection comments={request.comments} />
        )}
        
        {request.status === "pending" && (
          <>
            <Separator className="my-2" />
            <AddCommentForm 
              commentText={commentText}
              setCommentText={setCommentText}
              onSubmit={handleCommentSubmit}
            />
          </>
        )}
        
        <DialogFooter className="pt-2">
          <ActionButtons 
            isVisible={request.status === "pending"}
            onReject={handleReject}
            onApprove={handleApprove}
            isRejectPending={rejectMutation.isPending}
            isApprovePending={approveMutation.isPending}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
