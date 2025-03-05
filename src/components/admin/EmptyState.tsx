
import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface EmptyStateProps {
  type: "pending" | "approved" | "rejected";
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const config = {
    pending: {
      icon: Clock,
      title: "No pending requests",
      description: "All leave requests have been processed",
    },
    approved: {
      icon: CheckCircle2,
      title: "No approved requests",
      description: "There are no approved leave requests",
    },
    rejected: {
      icon: XCircle,
      title: "No rejected requests",
      description: "There are no rejected leave requests",
    },
  };

  const { icon: Icon, title, description } = config[type];

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  );
};

export default EmptyState;
