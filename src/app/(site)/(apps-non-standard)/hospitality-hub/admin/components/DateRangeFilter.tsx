// ─────────────────────────────────────────────────────────────
// components/DateRangeFilter.tsx
// Abstract, reusable date‐range picker with explicit Apply button
// ─────────────────────────────────────────────────────────────
"use client";

import { Flex, Box, Text, Input, Button } from "@chakra-ui/react";
import { useState } from "react";

interface DateRangeFilterProps {
  startDate: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onApply: () => void;
}

const DateRangeFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
}: DateRangeFilterProps) => {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  /**
   * Handle changes to the start date, updating local state only
   */
  const handleStartDateChange = (value: string) => {
    setLocalStartDate(value);
    onStartDateChange(value);
  };

  /**
   * Handle changes to the end date, updating local state only
   */
  const handleEndDateChange = (value: string) => {
    setLocalEndDate(value);
    onEndDateChange(value);
  };

  return (
    <Flex
      direction={["column", "row"]}
      gap={4}
      alignItems="flex-end"
      width="100%"
    >
      {/* Start date */}
      <Box width={["100%", null, "200px"]}>
        <Text fontSize="sm" mb={1} color="white">
          Start Date
        </Text>
        <Input
          type="date"
          value={localStartDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
          max={localEndDate}
          bgColor="white"
          w={["100%", null, "200px"]}
        />
      </Box>

      {/* End date */}
      <Box width={["100%", null, "200px"]}>
        <Text fontSize="sm" mb={1} color="white">
          End Date
        </Text>
        <Input
          type="date"
          value={localEndDate}
          onChange={(e) => handleEndDateChange(e.target.value)}
          min={localStartDate}
          bgColor="white"
          w={["100%", null, "200px"]}
        />
      </Box>

      {/* Apply button */}
      <Button w={"100px"} variant="primary" onClick={onApply} height="40px">
        Apply
      </Button>
    </Flex>
  );
};

export default DateRangeFilter;
