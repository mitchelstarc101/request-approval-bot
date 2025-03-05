
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaveReport } from "@/services/reportingService";
import StatsCard from "@/components/StatsCard";
import { BarChart4, Clock, CheckCircle2, XCircle, Calendar } from "lucide-react";

interface LeaveReportSummaryProps {
  report: LeaveReport;
}

const LeaveReportSummary: React.FC<LeaveReportSummaryProps> = ({ report }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Leave Requests"
        value={report.totalRequests}
        icon={<BarChart4 className="h-4 w-4" />}
        description="All time requests"
      />
      
      <StatsCard
        title="Pending Requests"
        value={report.byStatus.pending}
        icon={<Clock className="h-4 w-4" />}
        description="Awaiting approval"
      />
      
      <StatsCard
        title="Approved Requests"
        value={report.byStatus.approved}
        icon={<CheckCircle2 className="h-4 w-4" />}
        description="Successfully approved"
      />
      
      <StatsCard
        title="Rejected Requests"
        value={report.byStatus.rejected}
        icon={<XCircle className="h-4 w-4" />}
        description="Denied requests"
      />
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Average Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[100px]">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {report.averageDuration.toFixed(1)} days
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Average leave duration per request
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Leave Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(report.byType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-2 border rounded">
                <span className="font-medium capitalize">{type}</span>
                <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                  {count} requests
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveReportSummary;
