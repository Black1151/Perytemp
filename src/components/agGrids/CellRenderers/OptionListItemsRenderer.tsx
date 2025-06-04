"use client";

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { CustomCellRendererProps } from "ag-grid-react";
import { FormatListNumbered } from "@mui/icons-material";

// Define the interface for the component's props
interface OptionListItemRendererProps extends CustomCellRendererProps {
  nameField: string; // Field name for dynamic Site Name
  uniqueIdField: string; // Field name for dynamic Site Unique ID
}

const OptionListItemRenderer: React.FC<OptionListItemRendererProps> = ({
  node,
  nameField,
  uniqueIdField,
}) => {
  const optionListItem = node?.data;

  if (!optionListItem) {
    return null;
  }

  // Access fields dynamically using the provided field names
  const optionListItemName = optionListItem[nameField] ?? "No Item";
  const uniqueId = optionListItem[uniqueIdField];

  // Conditionally create a link only if uniqueId exists
  const link = uniqueId ? `/option-lists/items/${uniqueId}` : null;

  // Render the optionListItem name as text (inside a link if the optionListItem has a unique ID)
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
        <FormatListNumbered sx={{ color: "var(--chakra-colors-primary)" }} />
      </Box>
      <Text
        fontSize={"13px"}
        flex={1}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {optionListItemName}
      </Text>
    </Flex>
  );

  // Conditionally render the content inside a Link if uniqueId is present
  return link ? <Link href={link}>{content}</Link> : content;
};

export default OptionListItemRenderer;
