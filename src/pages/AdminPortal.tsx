
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { leaveRequestService, type LeaveRequest, type AuditLog } from "@/services/leaveRequestService";
import { useAuth } from "@/contexts/AuthContext";
import LeaveRequestCard from "@/components/LeaveRequestCard";
import LeaveRequestDetail from "@/components/LeaveRequestDetail";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { 
  FileText, 
  Filter, 
  Search, 
  Calendar,
  ClipboardList,
  HistoryIcon,
  CircleAlert,
  CheckCircle2,
  XCircle,
  MessageCircle
} from "lucide-react";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const leaveTypeOptions = [
  { value: "all", label: "All Types" },
  { value: "vacation", label: "Vacation" },
  { value: "sick", label: "Sick Leave" },
  { value: "personal", label: "Personal Leave" },
  { value: "bereavement", label: "Bereavement" },
  { value: "study", label: "Study Leave" },
  { value: "other", label: "Other" },
];

const AdminPortal = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activeTab, setActiveTab] = useState("requests");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need administrator privileges to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, navigate]);
  
  // Fetch data when component mounts
  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);
  
  // Filter requests when filters change
  useEffect(() => {
    filterRequests();
  }, [leaveRequests, statusFilter, typeFilter, searchQuery, dateFilter]);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch leave requests
      const requests = await leaveRequestService.getAllRequests();
      setLeaveRequests(requests);
      
      // Fetch audit logs
      const logs = await leaveRequestService.getAuditLogs();
      setAuditLogs(logs);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterRequests = () => {
    let filtered = [...leaveRequests];
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(req => 
        req.status?.toLowerCase() === statusFilter
      );
    }
    
    // Filter by leave type
    if (typeFilter !== "all") {
      filtered = filtered.filter(req => 
        req.leave_type?.toLowerCase() === typeFilter
      );
    }
    
    // Filter by search query (employee name)
    if (searchQuery) {
      filtered = filtered.filter(req => 
        req.user_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      
      filtered = filtered.filter(req => {
        const startDate = new Date(req.start_date);
        const endDate = new Date(req.end_date);
        
        return (
          filterDate >= startDate && filterDate <= endDate
        );
      });
    }
    
    setFilteredRequests(filtered);
  };
  
  const handleApproveRequest = async (id: string, comment: string) => {
    try {
      await leaveRequestService.approve(id, comment);
      
      toast({
        title: "Request Approved",
        description: "The leave request has been approved successfully.",
      });
      
      fetchData();
      setIsDetailDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to approve request.",
        variant: "destructive",
      });
    }
  };
  
  const handleRejectRequest = async (id: string, comment: string) => {
    try {
      await leaveRequestService.reject(id, comment);
      
      toast({
        title: "Request Rejected",
        description: "The leave request has been rejected successfully.",
      });
      
      fetchData();
      setIsDetailDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to reject request.",
        variant: "destructive",
      });
    }
  };
  
  const handleAddComment = async (id: string, comment: string) => {
    try {
      await leaveRequestService.addComment(id, comment);
      
      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully.",
      });
      
      // Refresh the request to show new comment
      const requests = await leaveRequestService.getAllRequests();
      setLeaveRequests(requests);
      
      // Update selected request with the new data
      const updatedRequest = requests.find(req => req.id === id);
      if (updatedRequest) {
        setSelectedRequest(updatedRequest);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to add comment.",
        variant: "destructive",
      });
    }
  };
  
  const openRequestDetail = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
  };
  
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Portal</h1>
          <p className="text-muted-foreground">
            Manage leave requests and view system activity
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={fetchData}
          className="self-end"
        >
          Refresh Data
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
          <TabsTrigger value="requests" className="flex gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>Leave Requests</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex gap-2">
            <HistoryIcon className="h-4 w-4" />
            <span>Audit Log</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="space-y-6 mt-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Requests
              </CardTitle>
              <CardDescription>
                Use the filters below to find specific leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Leave Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Employee Name</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Filter</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStatusFilter("all");
                    setTypeFilter("all");
                    setSearchQuery("");
                    setDateFilter("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Leave Requests */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 bg-muted/50 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map((request) => (
                <LeaveRequestCard
                  key={request.id}
                  request={{
                    ...request,
                    user: {
                      name: request.user_name || "",
                      email: ""
                    }
                  }}
                  isAdmin={true}
                  onApprove={() => handleApproveRequest(request.id!, "")}
                  onReject={() => handleRejectRequest(request.id!, "")}
                  onEdit={() => openRequestDetail(request)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-muted/30">
              <CircleAlert className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No leave requests found</h3>
              <p className="text-muted-foreground mt-2 text-center max-w-md">
                {statusFilter !== "all" || typeFilter !== "all" || searchQuery || dateFilter
                  ? "Try adjusting your filters to see more results."
                  : "There are no leave requests in the system yet."
                }
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="audit" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5" />
                System Audit Log
              </CardTitle>
              <CardDescription>
                View a history of all actions taken in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {auditLogs.length > 0 ? (
                  <div className="space-y-4">
                    {auditLogs
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((log) => (
                        <div key={log.id} className="flex gap-4 pb-4 border-b">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                            {log.action === "approve" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                            {log.action === "reject" && <XCircle className="h-5 w-5 text-red-500" />}
                            {log.action === "comment" && <MessageCircle className="h-5 w-5 text-blue-500" />}
                            {log.action === "create" && <FileText className="h-5 w-5 text-purple-500" />}
                            {log.action === "update" && <FileText className="h-5 w-5 text-amber-500" />}
                            {log.action === "delete" && <FileText className="h-5 w-5 text-gray-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium">{log.user_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(parseISO(log.created_at), "MMM dd, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                            <p className="text-sm mt-1">{log.details}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {log.entity_type.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <CircleAlert className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No audit logs found</h3>
                    <p className="text-muted-foreground mt-2 text-center">
                      System activity will be displayed here when actions are taken.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Leave Request Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedRequest && (
            <LeaveRequestDetail
              request={selectedRequest}
              isAdmin={true}
              onApprove={(comment) => handleApproveRequest(selectedRequest.id!, comment)}
              onReject={(comment) => handleRejectRequest(selectedRequest.id!, comment)}
              onAddComment={(comment) => handleAddComment(selectedRequest.id!, comment)}
              onClose={() => setIsDetailDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPortal;
