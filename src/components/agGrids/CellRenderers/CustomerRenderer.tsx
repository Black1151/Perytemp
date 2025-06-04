"use client";

import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import Link from "next/link";
import { CustomCellRendererProps } from "ag-grid-react";

// Define the interface for the props expected by the component
interface CustomerRendererProps extends CustomCellRendererProps {
  imageUrlField: string; // Field name for dynamic Image Url
  uniqueIdField: string; // Field name for dynamic ID
  nameField: string; // Field name for dynamic Name
}

const CustomerRenderer: React.FC<CustomerRendererProps> = ({
  node,
  nameField,
  uniqueIdField,
  imageUrlField,
}) => {
  const customer = node?.data;

  if (!customer) {
    return null;
  }

  const name = customer[nameField] ?? "Platform"; // Access the name dynamically using nameField
  const imageUrl = customer[imageUrlField]; // Access the Image dynamically using imageUrlField
  const uniqueId = customer[uniqueIdField]; // Access the unique ID dynamically using uniqueIdField

  const link = uniqueId ? `/customers/${uniqueId}` : null;

  // Common content that remains the same, with or without a link
  const content = (
    <Flex
      alignItems="center"
      justifyContent="flex-start"
      w="full"
      h="full"
      maxW="full"
      gap={4}
    >
      {imageUrl ? (
        <Box
          flexShrink={0}
          width="50px"
          height="50px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={1}
        >
          <Image
            src={imageUrl}
            alt={name}
            id={imageUrl}
            key={imageUrl}
            height="80%"
            maxW="100%"
            maxH="100%"
            objectFit="contain"
            // fallbackSrc="https://via.placeholder.com/50"
          />
        </Box>
      ) : (
        <Flex
          width={"50px"}
          height={"full"}
          align={"center"}
          justify={"center"}
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
            <BusinessOutlinedIcon
              sx={{ color: "var(--chakra-colors-primary)" }}
            />
          </Box>
        </Flex>
      )}
      <Text
        fontSize={"13px"}
        flex={1}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {name}
      </Text>
    </Flex>
  );

  // Conditionally wrap content in Link if a link exists
  return link ? <Link href={link}>{content}</Link> : content;
};

export default CustomerRenderer;
