
import React from "react";
import { format } from "date-fns";
import { Calendar, CalendarCheck } from "lucide-react";

interface DateRangeInfoProps {
  startDate: Date;
  endDate: Date;
}

const DateRangeInfo: React.FC<DateRangeInfoProps> = ({ startDate, endDate }) => {
  return (
    <>
      <div className="flex items-center text-sm">
        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
        <span>From: </span>
        <span className="ml-1 font-medium">{format(startDate, "MMM dd, yyyy")}</span>
      </div>
      
      <div className="flex items-center text-sm">
        <CalendarCheck className="h-4 w-4 mr-2 text-muted-foreground" />
        <span>To: </span>
        <span className="ml-1 font-medium">{format(endDate, "MMM dd, yyyy")}</span>
      </div>
    </>
  );
};

export default DateRangeInfo;
