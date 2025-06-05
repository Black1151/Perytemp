"use client";

import React from "react";
import Link from "next/link";
import { Flex, Text } from "@chakra-ui/react";
import { CustomCellRendererProps } from "ag-grid-react";

interface HospitalityLinkRendererProps extends CustomCellRendererProps {
  category: string;
  nameField: string;
  idField: string;
}

const HospitalityLinkRenderer: React.FC<HospitalityLinkRendererProps> = ({
  node,
  category,
  nameField,
  idField,
}) => {
  const item = node?.data;
  if (!item) return null;

  const name = item[nameField] ?? "Item";
  const id = item[idField];
  const link = id ? `/hospitality-hub/admin/${category}/${id}` : null;

  const content = (
    <Flex alignItems="center" justifyContent="flex-start" w="full" h="full">
      <Text
        fontSize="13px"
        flex={1}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {name}
      </Text>
    </Flex>
  );

  return link ? <Link href={link}>{content}</Link> : content;
};

export default HospitalityLinkRenderer;
