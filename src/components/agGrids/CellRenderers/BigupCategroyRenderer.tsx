"use client";

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { CustomCellRendererProps } from "ag-grid-react";
import { Celebration } from "@mui/icons-material";

// Define the interface for the component's props
interface BigupCategoryRendererProps extends CustomCellRendererProps {
  nameField: string; // Field name for dynamic Category Name
  uniqueIdField: string; // Field name for dynamic Category Unique ID
}

const BigupCategoryRenderer: React.FC<BigupCategoryRendererProps> = ({
  node,
  nameField,
  uniqueIdField,
}) => {
  const category = node?.data;

  if (!category) {
    return null;
  }

  // Access fields dynamically using the provided field names
  const categoryName = category[nameField] ?? "No Category";
  const uniqueId = category[uniqueIdField];

  // Conditionally create a link only if uniqueId exists
  const link = uniqueId ? `/bigup-categories/${uniqueId}` : null;

  // Render the category name as text (inside a link if the category has a unique ID)
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
        <Celebration sx={{ color: "var(--chakra-colors-primary)" }} />
      </Box>
      <Text
        fontSize={"13px"}
        flex={1}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {categoryName}
      </Text>
    </Flex>
  );

  // Conditionally render the content inside a Link if uniqueId is present
  return link ? <Link href={link}>{content}</Link> : content;
};

export default BigupCategoryRenderer;
