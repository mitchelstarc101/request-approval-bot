
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeaveTypeBadgeProps {
  leaveType: string;
  duration?: number;
  showDuration?: boolean;
}

const LeaveTypeBadge: React.FC<LeaveTypeBadgeProps> = ({ 
  leaveType, 
  duration,
  showDuration = false 
}) => {
  const leaveTypeConfig = {
    vacation: {
      label: "Vacation",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
    sick: {
      label: "Sick Leave",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    },
    personal: {
      label: "Personal Leave",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    },
    bereavement: {
      label: "Bereavement",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300",
    },
    study: {
      label: "Study Leave",
      color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    },
    other: {
      label: "Other",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300",
    },
  };

  const normalizedType = leaveType.toLowerCase() as keyof typeof leaveTypeConfig;
  
  if (showDuration && duration !== undefined) {
    return (
      <Badge 
        className={cn(
          "px-2.5 py-1 text-xs font-medium",
          leaveTypeConfig[normalizedType].color
        )}
      >
        {duration} {duration === 1 ? "day" : "days"}
      </Badge>
    );
  }
  
  return (
    <h3 className="text-lg font-medium">
      {leaveTypeConfig[normalizedType].label}
    </h3>
  );
};

export default LeaveTypeBadge;
