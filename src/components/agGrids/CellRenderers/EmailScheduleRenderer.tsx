"use client";

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { CustomCellRendererProps } from "ag-grid-react";
import { ScheduleSend } from "@mui/icons-material";

// Define the interface for the component's props
interface EmailScheduleRendererProps extends CustomCellRendererProps {
  nameField: string; // Field name for dynamic Site Name
  uniqueIdField: string; // Field name for dynamic Site Unique ID
}

const EmailScheduleRenderer: React.FC<EmailScheduleRendererProps> = ({
  node,
  nameField,
  uniqueIdField,
}) => {
  const emailSchedule = node?.data;

  if (!emailSchedule) {
    return null;
  }

  // Access fields dynamically using the provided field names
  const emailScheduleName = emailSchedule[nameField] ?? "No Schedule";
  const uniqueId = emailSchedule[uniqueIdField];

  // Conditionally create a link only if uniqueId exists
  const link = uniqueId ? `/email-schedule/${uniqueId}` : null;

  // Render the emailSchedule name as text (inside a link if the emailSchedule has a unique ID)
  const content = (
    <Flex
      alignItems="center"
      justifyContent="flex-start"
      w="full"
      h="full"
      maxW="full"
      gap={2}
    >
      <Box
        flexShrink={0}
        height="80%"
        aspectRatio={1}
        display="flex"
        alignItems="center"
        borderRadius={"full"}
        bg={"gray.100"}
        justifyContent="center"
      >
        <ScheduleSend sx={{ color: "var(--chakra-colors-primary)" }} />
      </Box>
      <Text
        fontSize={"13px"}
        flex={1}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {emailScheduleName}
      </Text>
    </Flex>
  );

  // Conditionally render the content inside a Link if uniqueId is present
  return link ? <Link href={link}>{content}</Link> : content;
};

export default EmailScheduleRenderer;
