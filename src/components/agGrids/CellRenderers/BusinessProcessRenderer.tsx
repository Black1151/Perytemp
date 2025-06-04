"use client";

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { CustomCellRendererProps } from "ag-grid-react";
import { Schema } from "@mui/icons-material";

// Define the interface for the component's props
interface BusinessProcessRendererProps extends CustomCellRendererProps {
  nameField: string; // Field name for dynamic Site Name
  uniqueIdField: string; // Field name for dynamic Site Unique ID
}

const BusinessProcessRenderer: React.FC<BusinessProcessRendererProps> = ({
  node,
  nameField,
  uniqueIdField,
}) => {
  const businessProcess = node?.data;

  if (!businessProcess) {
    return null;
  }

  // Access fields dynamically using the provided field names
  const businessProcessName =
    businessProcess[nameField] ?? "No Business Process";
  const uniqueId = businessProcess[uniqueIdField];

  // Conditionally create a link only if uniqueId exists
  const link = uniqueId ? `/business-processes/${uniqueId}` : null;

  // Render the businessProcess name as text (inside a link if the businessProcess has a unique ID)
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
        <Schema sx={{ color: "var(--chakra-colors-primary)" }} />
      </Box>
      <Text
        fontSize={"13px"}
        flex={1}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {businessProcessName}
      </Text>
    </Flex>
  );

  // Conditionally render the content inside a Link if uniqueId is present
  return link ? <Link href={link}>{content}</Link> : content;
};

export default BusinessProcessRenderer;
