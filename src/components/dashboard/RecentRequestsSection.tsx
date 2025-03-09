
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LeaveRequestTable from "@/components/admin/LeaveRequestTable";
import { CircleAlert } from "lucide-react";
import RequestDetailsDialog from "@/components/admin/RequestDetailsDialog";

interface RecentRequestsSectionProps {
  isLoading: boolean;
  recentRequests: any[];
  onViewDetails: (request: any) => void;
}

const RecentRequestsSection: React.FC<RecentRequestsSectionProps> = ({
  isLoading,
  recentRequests,
  onViewDetails
}) => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
    onViewDetails(request);
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-48 bg-muted/50 rounded-lg animate-pulse"></div>
          ) : recentRequests.length > 0 ? (
            <LeaveRequestTable 
              requests={recentRequests}
              onApprove={() => {}}
              onReject={() => {}}
              onViewDetails={handleViewDetails}
              showEmptyState={false}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 bg-muted/30 rounded-lg">
              <CircleAlert className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No recent leave requests found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <RequestDetailsDialog
        request={selectedRequest}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

export default RecentRequestsSection;
