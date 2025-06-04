"use client";

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { CustomCellRendererProps } from "ag-grid-react";
import { Email } from "@mui/icons-material";

// Define the interface for the component's props
interface EmailTemplateRendererProps extends CustomCellRendererProps {
  nameField: string; // Field name for dynamic Site Name
  uniqueIdField: string; // Field name for dynamic Site Unique ID
}

const EmailTemplateRenderer: React.FC<EmailTemplateRendererProps> = ({
  node,
  nameField,
  uniqueIdField,
}) => {
  const emailTemplate = node?.data;

  if (!emailTemplate) {
    return null;
  }

  // Access fields dynamically using the provided field names
  const emailTemplateName = emailTemplate[nameField] ?? "No Template";
  const uniqueId = emailTemplate[uniqueIdField];

  // Conditionally create a link only if uniqueId exists
  const link = uniqueId ? `/email-template/${uniqueId}` : null;

  // Render the emailTemplate name as text (inside a link if the emailTemplate has a unique ID)
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
        <Email sx={{ color: "var(--chakra-colors-primary)" }} />
      </Box>
      <Text
        fontSize={"13px"}
        flex={1}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {emailTemplateName}
      </Text>
    </Flex>
  );

  // Conditionally render the content inside a Link if uniqueId is present
  return link ? <Link href={link}>{content}</Link> : content;
};

export default EmailTemplateRenderer;
