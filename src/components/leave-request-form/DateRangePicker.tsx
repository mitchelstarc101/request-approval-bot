
import React from "react";
import DatePickerField from "./DatePickerField";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DatePickerField
        label="Start Date"
        date={startDate}
        onChange={onStartDateChange}
      />
      
      <DatePickerField
        label="End Date"
        date={endDate}
        onChange={onEndDateChange}
        disabled={(date) => date < startDate}
      />
    </div>
  );
};

export default DateRangePicker;
