
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { generateLeaveReport, getAuditLogs } from "@/services/reportingService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart4, FileText } from "lucide-react";
import LeaveReportSummary from "@/components/reports/LeaveReportSummary";
import MonthlyTrendsChart from "@/components/reports/MonthlyTrendsChart";
import AuditLogTable from "@/components/reports/AuditLogTable";

const Reports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch leave report data
  const { data: leaveReport, isLoading: isReportLoading } = useQuery({
    queryKey: ["leaveReport"],
    queryFn: generateLeaveReport
  });
  
  // Fetch audit logs
  const { data: auditLogs = [], isLoading: isLogsLoading } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: () => getAuditLogs()
  });
  
  // Filter audit logs based on search term
  const filteredLogs = auditLogs.filter(log => 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Reports & Logs</h1>
      
      <Tabs defaultValue="leave-reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="leave-reports" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            <span>Leave Reports</span>
          </TabsTrigger>
          <TabsTrigger value="audit-logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Audit Logs</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="leave-reports" className="space-y-6">
          {isReportLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : leaveReport ? (
            <>
              <LeaveReportSummary report={leaveReport} />
              <MonthlyTrendsChart data={leaveReport.monthlyDistribution} />
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No report data available</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="audit-logs">
          {isLogsLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <AuditLogTable 
              logs={filteredLogs} 
              onFilterChange={setSearchTerm} 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
