
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReasonFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ReasonField: React.FC<ReasonFieldProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="reason">Reason (Optional)</Label>
      <Textarea
        id="reason"
        placeholder="Please provide a reason for your leave request..."
        rows={4}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default ReasonField;
