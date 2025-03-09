
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const leaveTypes = [
  { value: "vacation", label: "Vacation" },
  { value: "sick", label: "Sick Leave" },
  { value: "personal", label: "Personal Leave" },
  { value: "bereavement", label: "Bereavement" },
  { value: "study", label: "Study Leave" },
  { value: "other", label: "Other" },
];

interface LeaveTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const LeaveTypeSelect: React.FC<LeaveTypeSelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="leave_type">Leave Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11">
          <SelectValue placeholder="Select leave type" />
        </SelectTrigger>
        <SelectContent>
          {leaveTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LeaveTypeSelect;
