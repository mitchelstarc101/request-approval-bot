
import React from "react";
import { AlertCircle } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ReasonDisplayProps {
  reason?: string;
}

const ReasonDisplay: React.FC<ReasonDisplayProps> = ({ reason }) => {
  if (!reason) return null;
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center text-sm cursor-help">
          <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="truncate">
            Reason: {reason.length > 30 
              ? `${reason.substring(0, 30)}...` 
              : reason
            }
          </span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="font-medium">Reason</div>
        <div className="text-sm mt-1">{reason}</div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ReasonDisplay;
