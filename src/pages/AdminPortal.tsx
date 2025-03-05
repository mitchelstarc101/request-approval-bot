
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Check, 
  X, 
  Filter, 
  Search, 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { leaveRequestService, type LeaveRequest, type Comment } from "@/services/leaveRequestService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import LeaveRequestCard from "@/components/LeaveRequestCard";

// Define the request with mandatory fields for the Admin Portal
interface AdminLeaveRequest extends LeaveRequest {
  id: string;
  status: string;
  user?: {
    name: string;
    email: string;
  };
}

const AdminPortal: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedRequest, setSelectedRequest] = useState<AdminLeaveRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all leave requests
  const { data: leaveRequests = [], isLoading, error } = useQuery({
    queryKey: ["adminLeaveRequests"],
    queryFn: leaveRequestService.getAllRequests
  });
  
  // Approve leave request mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => leaveRequestService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLeaveRequests"] });
      toast({
        title: "Request Approved",
        description: "The leave request has been approved successfully",
      });
      setIsDetailsOpen(false);
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
      setIsDetailsOpen(false);
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
  
  // Filter and search functionality
  const filteredRequests = leaveRequests.filter((request: LeaveRequest) => {
    // Filter by status
    if (filter !== "all" && request.status !== filter) {
      return false;
    }
    
    // Filter by date range
    if (startDate && new Date(request.start_date) < startDate) {
      return false;
    }
    
    if (endDate && new Date(request.end_date) > endDate) {
      return false;
    }
    
    // Search by user name or leave type
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const userNameMatch = request.user_name?.toLowerCase().includes(searchLower);
      const leaveTypeMatch = request.leave_type.toLowerCase().includes(searchLower);
      if (!userNameMatch && !leaveTypeMatch) {
        return false;
      }
    }
    
    return true;
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
    if (!selectedRequest || !commentText.trim()) return;
    
    commentMutation.mutate({
      leaveId: selectedRequest.id,
      text: commentText
    });
  };
  
  // View request details
  const viewRequestDetails = (request: AdminLeaveRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilter("all");
    setSearchTerm("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Admin Leave Request Portal</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Input
                placeholder="Search by employee or leave type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">From:</span>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                className="flex-1"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">To:</span>
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <Filter className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="pending" className="mb-4">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="pending" className="flex gap-2">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
            <Badge variant="secondary" className="ml-1">
              {leaveRequests.filter((r: LeaveRequest) => r.status === "pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Approved</span>
            <Badge variant="secondary" className="ml-1">
              {leaveRequests.filter((r: LeaveRequest) => r.status === "approved").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex gap-2">
            <XCircle className="h-4 w-4" />
            <span>Rejected</span>
            <Badge variant="secondary" className="ml-1">
              {leaveRequests.filter((r: LeaveRequest) => r.status === "rejected").length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredRequests.filter((r: LeaveRequest) => r.status === "pending").length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests
                .filter((r: LeaveRequest) => r.status === "pending")
                .map((request: LeaveRequest) => (
                  <LeaveRequestCard
                    key={request.id}
                    request={{
                      id: request.id,
                      leave_type: request.leave_type,
                      start_date: request.start_date,
                      end_date: request.end_date,
                      status: request.status,
                      reason: request.reason,
                      user: {
                        name: request.user_name || "Employee",
                        email: "",
                      },
                    }}
                    isAdmin={true}
                    onApprove={() => handleApprove(request.id)}
                    onReject={() => handleReject(request.id)}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Clock className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No pending requests</h3>
              <p className="text-muted-foreground mt-1">
                All leave requests have been processed
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="approved">
          {/* Similar structure for approved requests */}
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredRequests.filter((r: LeaveRequest) => r.status === "approved").length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests
                .filter((r: LeaveRequest) => r.status === "approved")
                .map((request: LeaveRequest) => (
                  <LeaveRequestCard
                    key={request.id}
                    request={{
                      id: request.id,
                      leave_type: request.leave_type,
                      start_date: request.start_date,
                      end_date: request.end_date,
                      status: request.status,
                      reason: request.reason,
                      user: {
                        name: request.user_name || "Employee",
                        email: "",
                      },
                    }}
                    isAdmin={true}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No approved requests</h3>
              <p className="text-muted-foreground mt-1">
                There are no approved leave requests
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected">
          {/* Similar structure for rejected requests */}
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredRequests.filter((r: LeaveRequest) => r.status === "rejected").length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests
                .filter((r: LeaveRequest) => r.status === "rejected")
                .map((request: LeaveRequest) => (
                  <LeaveRequestCard
                    key={request.id}
                    request={{
                      id: request.id,
                      leave_type: request.leave_type,
                      start_date: request.start_date,
                      end_date: request.end_date,
                      status: request.status,
                      reason: request.reason,
                      user: {
                        name: request.user_name || "Employee",
                        email: "",
                      },
                    }}
                    isAdmin={true}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <XCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No rejected requests</h3>
              <p className="text-muted-foreground mt-1">
                There are no rejected leave requests
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <span className="text-sm font-medium">Employee:</span>
                <span className="col-span-3">{selectedRequest.user?.name || selectedRequest.user_name}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <span className="text-sm font-medium">Leave Type:</span>
                <span className="col-span-3">{selectedRequest.leave_type}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <span className="text-sm font-medium">From:</span>
                <span className="col-span-3">{format(new Date(selectedRequest.start_date), "PPP")}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <span className="text-sm font-medium">To:</span>
                <span className="col-span-3">{format(new Date(selectedRequest.end_date), "PPP")}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <span className="col-span-3">
                  <Badge className={
                    selectedRequest.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                    selectedRequest.status === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  }>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </Badge>
                </span>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-2">
                <span className="text-sm font-medium">Reason:</span>
                <span className="col-span-3">{selectedRequest.reason || "No reason provided"}</span>
              </div>
              
              {selectedRequest.comments && selectedRequest.comments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Comments</h4>
                  <ScrollArea className="h-[150px] rounded-md border p-2">
                    {selectedRequest.comments.map((comment: Comment) => (
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
              
              {selectedRequest.status === "pending" && (
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
              {selectedRequest.status === "pending" && (
                <div className="flex w-full justify-between">
                  <Button
                    variant="outline"
                    className="text-destructive"
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={rejectMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  
                  <Button
                    onClick={() => handleApprove(selectedRequest.id)}
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
      )}
    </div>
  );
};

export default AdminPortal;
