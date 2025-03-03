
import React, { useState, useEffect } from "react";
import { leaveRequestService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import LeaveRequestCard from "@/components/LeaveRequestCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import LeaveRequestForm from "@/components/LeaveRequestForm";
import { PlusCircle, Filter, CircleAlert } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

const LeaveRequests = () => {
  const { isAdmin } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<any>(null);

  useEffect(() => {
    fetchRequests();
  }, [isAdmin]);

  useEffect(() => {
    filterRequests();
  }, [leaveRequests, statusFilter, typeFilter]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = isAdmin 
        ? await leaveRequestService.getAllRequests()
        : await leaveRequestService.getMyRequests();
      
      setLeaveRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...leaveRequests];
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((req: any) => 
        req.status.toLowerCase() === statusFilter
      );
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter((req: any) => 
        req.leave_type.toLowerCase() === typeFilter
      );
    }
    
    setFilteredRequests(filtered);
  };

  const handleCreateRequest = async (formData: any) => {
    try {
      await leaveRequestService.create(formData);
      setIsDialogOpen(false);
      fetchRequests();
    } catch (error) {
      throw error;
    }
  };

  const handleEditRequest = async (formData: any) => {
    try {
      if (currentRequest) {
        await leaveRequestService.update(currentRequest.id, formData);
        setIsDialogOpen(false);
        fetchRequests();
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteRequest = async () => {
    try {
      if (currentRequest) {
        await leaveRequestService.delete(currentRequest.id);
        setIsDeleteDialogOpen(false);
        
        toast({
          title: "Request deleted",
          description: "The leave request has been deleted successfully.",
        });
        
        fetchRequests();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      await leaveRequestService.approve(id);
      
      toast({
        title: "Request approved",
        description: "The leave request has been approved successfully.",
      });
      
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await leaveRequestService.reject(id);
      
      toast({
        title: "Request rejected",
        description: "The leave request has been rejected successfully.",
      });
      
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditDialog = (request: any) => {
    setCurrentRequest(request);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (request: any) => {
    setCurrentRequest(request);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          {isAdmin ? "All Leave Requests" : "My Leave Requests"}
        </h1>
        
        {!isAdmin && (
          <Button 
            size="lg" 
            className="flex items-center gap-2"
            onClick={() => {
              setCurrentRequest(null);
              setIsDialogOpen(true);
            }}
          >
            <PlusCircle size={18} />
            New Request
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10">
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
        
        <div className="flex-1">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-10">
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10">
              <Filter size={16} className="mr-2" />
              More Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => {
              setStatusFilter("all");
              setTypeFilter("all");
            }}>
              Clear Filters
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
              Show Only Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              const currentYear = new Date().getFullYear();
              // TODO: Implement date range filter
            }}>
              This Year Only
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Requests */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-64 bg-muted/50 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((request: any) => (
            <LeaveRequestCard
              key={request.id}
              request={request}
              isAdmin={isAdmin}
              onEdit={
                !isAdmin && request.status === "pending" 
                  ? () => openEditDialog(request) 
                  : undefined
              }
              onDelete={
                !isAdmin && request.status === "pending" 
                  ? () => openDeleteDialog(request) 
                  : undefined
              }
              onApprove={
                isAdmin && request.status === "pending" 
                  ? () => handleApproveRequest(request.id) 
                  : undefined
              }
              onReject={
                isAdmin && request.status === "pending" 
                  ? () => handleRejectRequest(request.id) 
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-muted/30">
          <CircleAlert className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">No leave requests found</h3>
          <p className="text-muted-foreground mt-2 text-center max-w-md">
            {statusFilter !== "all" || typeFilter !== "all" 
              ? "Try adjusting your filters to see more results." 
              : isAdmin 
                ? "There are no leave requests in the system yet." 
                : "You haven't created any leave requests yet."
            }
          </p>
          
          {!isAdmin && (
            <Button className="mt-6" onClick={() => setIsDialogOpen(true)}>
              Create a Leave Request
            </Button>
          )}
        </div>
      )}

      {/* Create/Edit Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentRequest ? "Edit Leave Request" : "New Leave Request"}
            </DialogTitle>
          </DialogHeader>
          
          <LeaveRequestForm
            initialData={currentRequest}
            onSubmit={currentRequest ? handleEditRequest : handleCreateRequest}
            isEditing={!!currentRequest}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              leave request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRequest}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeaveRequests;
