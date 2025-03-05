
import React, { useState } from "react";
import { format } from "date-fns";
import { MessageSquare, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveRequestService, type Comment } from "@/services/leaveRequestService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  // Approve leave request mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => leaveRequestService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLeaveRequests"] });
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
  
  // Reject leave request mutation
  const rejectMutation = useMutation({
    mutationFn: (id: string) => leaveRequestService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLeaveRequests"] });
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
  
  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: ({ leaveId, text }: { leaveId: string; text: string }) => 
      leaveRequestService.addComment(leaveId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLeaveRequests"] });
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

  // Handle approve button click
  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };
  
  // Handle reject button click
  const handleReject = (id: string) => {
    rejectMutation.mutate(id);
  };
  
  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !commentText.trim()) return;
    
    commentMutation.mutate({
      leaveId: request.id,
      text: commentText
    });
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Leave Request Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-2">
            <span className="text-sm font-medium">Employee:</span>
            <span className="col-span-3">{request.user?.name || request.user_name}</span>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <span className="text-sm font-medium">Leave Type:</span>
            <span className="col-span-3">{request.leave_type}</span>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <span className="text-sm font-medium">From:</span>
            <span className="col-span-3">{format(new Date(request.start_date), "PPP")}</span>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <span className="text-sm font-medium">To:</span>
            <span className="col-span-3">{format(new Date(request.end_date), "PPP")}</span>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <span className="col-span-3">
              <Badge className={
                request.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                request.status === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
              }>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </span>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-2">
            <span className="text-sm font-medium">Reason:</span>
            <span className="col-span-3">{request.reason || "No reason provided"}</span>
          </div>
          
          {request.comments && request.comments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Comments</h4>
              <ScrollArea className="h-[150px] rounded-md border p-2">
                {request.comments.map((comment: Comment) => (
                  <div key={comment.id} className="mb-3 pb-3 border-b last:border-0">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{comment.user_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.created_at), "PPp")}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.text}</p>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
          
          {request.status === "pending" && (
            <>
              <Separator className="my-2" />
              
              <form onSubmit={handleCommentSubmit}>
                <div className="mb-4">
                  <label htmlFor="comment" className="text-sm font-medium">
                    Add Comment
                  </label>
                  <Textarea
                    id="comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Enter your comment here..."
                    className="mt-1"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="submit" variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
        
        <DialogFooter>
          {request.status === "pending" && (
            <div className="flex w-full justify-between">
              <Button
                variant="outline"
                className="text-destructive"
                onClick={() => handleReject(request.id)}
                disabled={rejectMutation.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
              
              <Button
                onClick={() => handleApprove(request.id)}
                disabled={approveMutation.isPending}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
