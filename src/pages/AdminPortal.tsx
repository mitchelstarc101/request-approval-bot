
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { leaveRequestService, type LeaveRequest } from "@/services";
import FilterPanel from "@/components/admin/FilterPanel";
import RequestTabs from "@/components/admin/RequestTabs";
import RequestDetailsDialog from "@/components/admin/RequestDetailsDialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
  
  // Fetch all leave requests
  const { data: leaveRequests = [], isLoading, error } = useQuery({
    queryKey: ["adminLeaveRequests"],
    queryFn: leaveRequestService.getAllRequests
  });
  
  // Filter and search functionality
  const filteredRequests = (leaveRequests as LeaveRequest[]).filter((request: LeaveRequest) => {
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

  // Handle approve button click
  const handleApprove = (id: string) => {
    const request = (leaveRequests as LeaveRequest[]).find(r => r.id === id) as AdminLeaveRequest;
    if (request) {
      setSelectedRequest(request);
      setIsDetailsOpen(true);
    }
  };
  
  // Handle reject button click
  const handleReject = (id: string) => {
    const request = (leaveRequests as LeaveRequest[]).find(r => r.id === id) as AdminLeaveRequest;
    if (request) {
      setSelectedRequest(request);
      setIsDetailsOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Admin Leave Request Portal</h1>
      
      <FilterPanel
        filter={filter}
        setFilter={setFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        resetFilters={resetFilters}
      />
      
      <RequestTabs
        isLoading={isLoading}
        requests={leaveRequests as LeaveRequest[]}
        filteredRequests={filteredRequests}
        onApprove={handleApprove}
        onReject={handleReject}
        onViewDetails={viewRequestDetails}
      />
      
      <RequestDetailsDialog
        request={selectedRequest}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default AdminPortal;

