
import React, { useState } from "react";
import { Clock, CheckCircle2, XCircle, LayoutList, Table as TableIcon } from "lucide-react";
import { LeaveRequest } from "@/services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import LeaveRequestCard from "@/components/LeaveRequestCard";
import LeaveRequestTable from "@/components/admin/LeaveRequestTable";
import EmptyState from "@/components/admin/EmptyState";

interface RequestTabsProps {
  isLoading: boolean;
  requests: LeaveRequest[];
  filteredRequests: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (request: LeaveRequest) => void;
}

const RequestTabs: React.FC<RequestTabsProps> = ({
  isLoading,
  requests,
  filteredRequests,
  onApprove,
  onReject,
  onViewDetails,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const renderLoadingState = () => (
    <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  const renderViewToggle = () => (
    <div className="flex justify-end mb-4">
      <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "table")}>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutList className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="table" aria-label="Table view">
          <TableIcon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );

  const renderRequestsList = (status: string) => {
    const statusRequests = filteredRequests.filter(
      (r: LeaveRequest) => r.status === status
    );

    if (statusRequests.length === 0) {
      return <EmptyState type={status as "pending" | "approved" | "rejected"} />;
    }

    if (viewMode === "table") {
      return (
        <LeaveRequestTable
          requests={statusRequests}
          onApprove={onApprove}
          onReject={onReject}
          onViewDetails={onViewDetails}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statusRequests.map((request: LeaveRequest) => (
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
            onApprove={status === "pending" ? () => onApprove(request.id) : undefined}
            onReject={status === "pending" ? () => onReject(request.id) : undefined}
            onViewDetails={() => onViewDetails(request)}
          />
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="pending" className="mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="pending" className="flex gap-2">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
            <Badge variant="secondary" className="ml-1">
              {requests.filter((r: LeaveRequest) => r.status === "pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Approved</span>
            <Badge variant="secondary" className="ml-1">
              {requests.filter((r: LeaveRequest) => r.status === "approved").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex gap-2">
            <XCircle className="h-4 w-4" />
            <span>Rejected</span>
            <Badge variant="secondary" className="ml-1">
              {requests.filter((r: LeaveRequest) => r.status === "rejected").length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        {!isLoading && renderViewToggle()}
      </div>
      
      <TabsContent value="pending">
        {isLoading ? renderLoadingState() : renderRequestsList("pending")}
      </TabsContent>
      
      <TabsContent value="approved">
        {isLoading ? renderLoadingState() : renderRequestsList("approved")}
      </TabsContent>
      
      <TabsContent value="rejected">
        {isLoading ? renderLoadingState() : renderRequestsList("rejected")}
      </TabsContent>
    </Tabs>
  );
};

export default RequestTabs;
