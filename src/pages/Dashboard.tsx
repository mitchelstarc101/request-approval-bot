
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { leaveRequestService } from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import StatsCard from "@/components/StatsCard";
import LeaveRequestCard from "@/components/LeaveRequestCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import LeaveRequestForm from "@/components/LeaveRequestForm";
import { PlusCircle, Calendar, Clock, CheckCircle, XCircle, CircleAlert } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await leaveRequestService.getMyRequests();
      setLeaveRequests(data);
      
      // Calculate stats
      const pending = data.filter((req: any) => req.status === "pending").length;
      const approved = data.filter((req: any) => req.status === "approved").length;
      const rejected = data.filter((req: any) => req.status === "rejected").length;
      
      setStats({
        pending,
        approved,
        rejected,
        total: data.length,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
          description: "Your leave request has been deleted successfully.",
        });
        
        fetchRequests();
      }
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
        
        <Button 
          size="lg" 
          className="flex items-center gap-2"
          onClick={() => {
            setCurrentRequest(null);
            setIsDialogOpen(true);
          }}
        >
          <PlusCircle size={18} />
          New Leave Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Requests"
          value={stats.total}
          icon={<Calendar className="h-5 w-5 text-primary" />}
          description="All leave requests"
        />
        
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={<Clock className="h-5 w-5 text-yellow-500" />}
          description="Awaiting approval"
        />
        
        <StatsCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          description="Approved requests"
        />
        
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          description="Declined requests"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Leave Requests</h2>
          
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
                  request.status === "pending" ? () => openEditDialog(request) : undefined
                }
                onDelete={
                  request.status === "pending" ? () => openDeleteDialog(request) : undefined
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
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              Create Your First Request
            </Button>
          </div>
        )}
      </div>

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
              This action cannot be undone. This will permanently delete your
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

export default Dashboard;
