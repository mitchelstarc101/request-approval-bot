
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LeaveTypeSelect, 
  DateRangePicker, 
  ReasonField, 
  SubmitButton 
} from "./leave-request-form";
import { calculateDuration } from "./leave-request/utils";

interface LeaveRequestFormProps {
  initialData?: {
    id?: string;
    leave_type: string;
    start_date: Date;
    end_date: Date;
    reason: string;
  };
  onSubmit: (data: any) => Promise<void>;
  isEditing?: boolean;
  adminOverride?: boolean;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ 
  initialData, 
  onSubmit, 
  isEditing = false,
  adminOverride = false
}) => {
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    leave_type: initialData?.leave_type || "vacation",
    start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
    end_date: initialData?.end_date ? new Date(initialData.end_date) : new Date(),
    reason: initialData?.reason || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLeaveTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, leave_type: value }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, start_date: date }));
      
      // If end date is before start date, update end date
      if (formData.end_date < date) {
        setFormData((prev) => ({ ...prev, end_date: date }));
      }
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, end_date: date }));
    }
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, reason: e.target.value }));
  };

  const validateLeaveDuration = (type: string, startDate: Date, endDate: Date): boolean => {
    // Admins can bypass validation or if explicitly passed adminOverride
    if (isAdmin || adminOverride) return true;
    
    const duration = calculateDuration(startDate, endDate);
    
    if (type === "personal" && duration > 12) {
      toast({
        title: "Duration exceeds limit",
        description: "Personal leave cannot exceed 12 days. Please adjust your dates or contact an administrator.",
        variant: "destructive",
      });
      return false;
    }
    
    if (type === "sick" && duration > 6) {
      toast({
        title: "Duration exceeds limit",
        description: "Sick leave cannot exceed 6 days. Please adjust your dates or contact an administrator.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dates
    if (formData.end_date < formData.start_date) {
      toast({
        title: "Invalid date range",
        description: "End date cannot be before start date.",
        variant: "destructive",
      });
      return;
    }

    // Validate leave duration based on type
    if (!validateLeaveDuration(formData.leave_type, formData.start_date, formData.end_date)) {
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(formData);
      
      toast({
        title: isEditing ? "Request updated" : "Request submitted",
        description: isEditing 
          ? "Your leave request has been updated successfully." 
          : "Your leave request has been submitted successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: (error as Error).message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LeaveTypeSelect 
        value={formData.leave_type} 
        onChange={handleLeaveTypeChange} 
      />

      <DateRangePicker
        startDate={formData.start_date}
        endDate={formData.end_date}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
      />

      <ReasonField
        value={formData.reason}
        onChange={handleReasonChange}
      />

      <SubmitButton isLoading={isLoading} isEditing={isEditing} />
    </form>
  );
};

export default LeaveRequestForm;
