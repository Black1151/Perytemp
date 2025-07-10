// components/AdminTabItem.tsx
"use client";
import { Tab, Text } from "@chakra-ui/react";
import React from "react";

interface AdminTabItemProps {
  label: string;
  icon: React.ReactElement;
}

export const AdminTabItem: React.FC<AdminTabItemProps> = ({ label, icon }) => (
  <Tab
    fontWeight="bold"
    py={[2, 2, 3]}
    px={[2, 2, 3]}
    mx={[1, 2, 2]}
    fontSize={["sm", "md", "lg"]}
    borderRadius="md"
    transition="all 0.2s"
    _selected={{
      bgGradient: "linear(to-r, primary, secondary)",
      color: "white",
      boxShadow: "lg",
      transform: "scale(1.05)",
      fontWeight: "extrabold",
    }}
    display="flex"
    alignItems="center"
    gap={1}
    color="white"
    w="100%"
    flexDirection={["column", "row"]}
  >
    {icon}
    <Text fontSize={["xs", "sm"]}>{label}</Text>
  </Tab>
);
