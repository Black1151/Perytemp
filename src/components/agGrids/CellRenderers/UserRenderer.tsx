"use client";

import React from "react";
import { Flex, Text, Avatar, Box } from "@chakra-ui/react";
import Link from "next/link";
import { CustomCellRendererProps } from "ag-grid-react";

// Define the interface for the component's props
interface UserRendererProps extends CustomCellRendererProps {
  uniqueIdField: string; // Field name for dynamic User Unique ID
  imageUrlField: string; // Field name for dynamic Image URL
  nameField: string; // Field name for dynamic Full Name
  contact?: Contact; // Optional contact object
}

interface Contact {
  [key: string]: any; // Support dynamic fields in contact object
}

const UserRenderer: React.FC<UserRendererProps> = ({
  data: contact,
  uniqueIdField,
  imageUrlField,
  nameField,
}) => {
  if (!contact) {
    return null;
  }

  // Access fields dynamically using the provided field names
  const uniqueId = contact[uniqueIdField];
  const imageUrl = contact[imageUrlField];
  const fullName = contact[nameField] ?? "No Name";

  // Conditionally create a link only if uniqueId exists
  const link = uniqueId ? `/users/${uniqueId}` : null;

  // Common content to display user information
  const content = (
    <Flex
      alignItems="center"
      justifyContent="flex-start"
      w="full"
      h="full"
      maxW="full"
      maxH={"42px"}
      gap={4}
    >
      <Box height={"80%"}>
        <Avatar name={fullName} src={imageUrl} size={"sm"} />
      </Box>
      <Text
        fontSize={"13px"}
        flex={1}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {fullName}
      </Text>
    </Flex>
  );

  // Conditionally render the content inside a Link if uniqueId is present
  return link ? <Link href={link}>{content}</Link> : content;
};

export default UserRenderer;
