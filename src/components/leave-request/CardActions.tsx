
import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardActionsProps {
  status: string;
  isAdmin: boolean;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  onApprove?: (e: React.MouseEvent) => void;
  onReject?: (e: React.MouseEvent) => void;
}

const CardActions: React.FC<CardActionsProps> = ({
  status,
  isAdmin,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}) => {
  if (status !== "pending") {
    return null;
  }

  return (
    <>
      {onEdit && (
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
      )}
      
      {onDelete && (
        <Button variant="outline" size="sm" className="text-destructive" onClick={onDelete}>
          Delete
        </Button>
      )}
      
      {isAdmin && (
        <>
          {onApprove && (
            <Button size="sm" className="ml-auto gap-1" onClick={onApprove}>
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </Button>
          )}
          
          {onReject && (
            <Button variant="outline" size="sm" className="text-destructive gap-1" onClick={onReject}>
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default CardActions;
