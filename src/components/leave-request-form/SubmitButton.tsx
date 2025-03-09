
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  isEditing: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, isEditing }) => {
  return (
    <Button 
      type="submit" 
      className="h-11 min-w-[120px]"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? "Updating..." : "Submitting..."}
        </>
      ) : (
        isEditing ? "Update Request" : "Submit Request"
      )}
    </Button>
  );
};

export default SubmitButton;
