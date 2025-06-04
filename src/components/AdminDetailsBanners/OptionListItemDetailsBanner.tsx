"use client";

import React from "react";
import {
  Box,
  Flex,
  FormControl,
  Heading,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import CreateIcon from "@mui/icons-material/Create";
import UpdateIcon from "@mui/icons-material/Update";
import { FormatListNumbered } from "@mui/icons-material";
import BackButton from "@/components/BackButton";

export interface OptionListItem {
  id: number;
  optionListId: number;
  value1: string;
  value2: string | null;
  value3?: string | null;
  value4?: string | null;
  value5?: string | null;
  valueJson?: any; // JSON object, can be any structure
  imageUrl?: string | null; // URL to an image
  sortOrder?: number;
  isActive: boolean;
  createdAt: string; // ISO date string (e.g., "2023-10-01T12:00:00Z")
  updatedAt: string; // ISO date string (e.g., "2023-10-10T12:00:00Z")
  createdBy: number;
  updatedBy: number;
}

interface OptionListItemDetailsBannerProps {
  optionListItem: OptionListItem;
}

export const OptionListItemDetailsBanner: React.FC<
  OptionListItemDetailsBannerProps
> = ({ optionListItem }) => {
  const theme = useTheme();
  return (
    <Flex
      p={4}
      color={theme.colors.adminBannerColor}
      overflow={"hidden"}
      gap={2}
    >
      <BackButton />
      {/* OptionList Icon and Name */}
      {/* Site Icon and Name */}
      <FormControl
        w={["50px", "125px"]}
        h={["50px", "125px"]}
        aspectRatio={1}
        borderRadius={"full"}
      >
        <Box
          position="relative"
          w={["50px", "125px"]}
          h={["50px", "125px"]}
          borderRadius="full"
          bg="gray.100"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <FormatListNumbered
            fontSize="large"
            sx={{ color: "var(--chakra-colors-primary)" }}
          />
        </Box>
      </FormControl>

      {/* OptionList Information */}
      <VStack align="start" ml={4} spacing={3}>
        <Flex alignItems="center" gap={2}>
          <Box
            w={"1.4rem"}
            h={"1.4rem"}
            borderRadius="full"
            border={"white 1px solid"}
            bg={optionListItem.isActive ? "green.500" : "red.500"}
          />
          <Heading fontWeight={300} size={["sm", "md", "lg"]}>
            {optionListItem.value1}
          </Heading>
        </Flex>
      </VStack>

      {/* Metadata Information */}
      <VStack
        ml={"auto"}
        alignItems={"end"}
        justifyContent={"flex-start"}
        display={["none", "none", "flex"]}
      >
        <Heading size={["sm", "md", "lg"]} fontWeight={100}>
          ID: {optionListItem.id}
        </Heading>
        <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
          <CreateIcon />
          <Text fontSize="sm">
            {moment(optionListItem.createdAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
        <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
          <UpdateIcon />
          <Text fontSize="sm">
            {moment(optionListItem.updatedAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
      </VStack>
    </Flex>
  );
};
