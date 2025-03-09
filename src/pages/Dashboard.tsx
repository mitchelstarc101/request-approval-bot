
import React, { useState, useEffect } from "react";
import { leaveRequestService } from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// Importing our newly created components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsSection from "@/components/dashboard/StatsSection";
import RecentRequestsSection from "@/components/dashboard/RecentRequestsSection";
import LeaveRequestsSection from "@/components/dashboard/LeaveRequestsSection";
import DashboardDialogs from "@/components/dashboard/DashboardDialogs";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
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

  const openNewRequestDialog = () => {
    setCurrentRequest(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (request: any) => {
    setCurrentRequest(request);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (request: any) => {
    setCurrentRequest(request);
    setIsDeleteDialogOpen(true);
  };

  const viewRequestDetails = (request: any) => {
    setCurrentRequest(request);
    // The modal is now handled in the RecentRequestsSection component
  };

  // Get recent requests (last 5)
  const recentRequests = [...leaveRequests]
    .sort((a: any, b: any) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      <DashboardHeader 
        userName={user?.name} 
        onNewRequest={openNewRequestDialog} 
      />

      <StatsSection stats={stats} />

      <RecentRequestsSection 
        isLoading={isLoading}
        recentRequests={recentRequests}
        onViewDetails={viewRequestDetails}
      />

      <LeaveRequestsSection 
        isLoading={isLoading}
        leaveRequests={leaveRequests}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        onCreateRequest={openNewRequestDialog}
      />

      <DashboardDialogs 
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        currentRequest={currentRequest}
        onEdit={handleEditRequest}
        onCreate={handleCreateRequest}
        onDelete={handleDeleteRequest}
      />
    </div>
  );
};

export default Dashboard;
