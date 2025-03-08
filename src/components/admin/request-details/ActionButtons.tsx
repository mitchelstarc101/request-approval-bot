
import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  isVisible: boolean;
  onReject: () => void;
  onApprove: () => void;
  isRejectPending: boolean;
  isApprovePending: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isVisible,
  onReject,
  onApprove,
  isRejectPending,
  isApprovePending,
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="flex w-full justify-between">
      <Button
        variant="outline"
        className="text-destructive h-7 text-xs"
        onClick={onReject}
        disabled={isRejectPending}
      >
        <X className="h-3 w-3 mr-1" />
        Reject
      </Button>
      
      <Button
        onClick={onApprove}
        disabled={isApprovePending}
        className="h-7 text-xs"
      >
        <Check className="h-3 w-3 mr-1" />
        Approve
      </Button>
    </div>
  );
};

export default ActionButtons;
