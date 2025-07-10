import React from "react";
import { Badge, HStack, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { ICellRendererParams } from "ag-grid-community";

const DateTimeBadgeRenderer: React.FC<ICellRendererParams> = ({ data }) => {
  if (!data) return null;
  const { startDate, endDate, startTime, endTime } = data;
  const startDateStr = startDate
    ? format(new Date(startDate), "dd-MM-yyyy")
    : null;
  const endDateStr = endDate ? format(new Date(endDate), "dd-MM-yyyy") : null;
  const startTimeStr = startTime || null;
  const endTimeStr = endTime || null;

  //   return (
  //     <HStack spacing={2} p={0} m={0}>
  //       {startDateStr && (
  //         <Badge colorScheme="green" px={2} h={"20px"} m={0} alignContent={"center"}>
  //           Start: {startDateStr}{startTimeStr ? ` ${startTimeStr}` : ""}
  //         </Badge>
  //       )}
  //       {(endDateStr || endTimeStr) && (
  //         <Badge colorScheme="red" px={2} h={"20px"} m={0}>
  //           End:{endDateStr ? ` ${endDateStr}` : ""}{endTimeStr ? ` ${endTimeStr}` : ""}
  //         </Badge>
  //       )}
  //     </HStack>
  //   );
  return (
    <HStack
      spacing={2}
      mt={1}
      display="flex"
      alignItems="center"
      justifyContent="start"
    >
      {startDateStr && (
        <Badge
          colorScheme="green"
          px={2}
          w={"min"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          h={"30px"}
          borderRadius={"full"}
        >
          <Text>
            Start: {startDateStr}
            {startTimeStr ? ` ${startTimeStr}` : ""}
          </Text>
        </Badge>
      )}
      {(endDateStr || endTimeStr) && (
        <Badge
          colorScheme="red"
          px={2}
          w={"min"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          h={"30px"}
          borderRadius={"full"}
        >
          <Text>
            End: {endDateStr}
            {endTimeStr ? ` ${endTimeStr}` : ""}
          </Text>
        </Badge>
      )}
    </HStack>
  );
};

export default DateTimeBadgeRenderer;
