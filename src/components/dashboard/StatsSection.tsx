
import React from "react";
import StatsCard from "@/components/StatsCard";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

interface StatsSectionProps {
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
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
  );
};

export default StatsSection;
