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

export interface OptionListGroup {
  id: number;
  name: string;
  description?: string;
  customerId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

interface OptionListGroupDetailsBannerProps {
  optionListGroup: OptionListGroup;
}

export const OptionListGroupDetailsBanner: React.FC<
  OptionListGroupDetailsBannerProps
> = ({ optionListGroup }) => {
  const theme = useTheme();
  return (
    <Flex
      p={4}
      color={theme.colors.adminBannerColor}
      overflow={"hidden"}
      gap={2}
    >
      <BackButton />
      {/* OptionListGroup Icon and Name */}
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

      {/* OptionListGroup Information */}
      <VStack align="start" ml={4} spacing={3}>
        <Flex alignItems="center" gap={2}>
          <Box
            w={"1.4rem"}
            h={"1.4rem"}
            borderRadius="full"
            border={"white 1px solid"}
            bg={optionListGroup.isActive ? "green.500" : "red.500"}
          />
          <Heading fontWeight={300} size={["sm", "md", "lg"]}>
            {optionListGroup.name}
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
          ID: {optionListGroup.id}
        </Heading>
        <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
          <CreateIcon />
          <Text fontSize="xs">
            {moment(optionListGroup.createdAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
        <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
          <UpdateIcon />
          <Text fontSize="xs">
            {moment(optionListGroup.updatedAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
      </VStack>
    </Flex>
  );
};
