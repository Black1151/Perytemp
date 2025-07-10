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
import { Celebration } from "@mui/icons-material";
import moment from "moment";
import CreateIcon from "@mui/icons-material/Create";
import UpdateIcon from "@mui/icons-material/Update";
import BackButton from "@/components/BackButton";

interface BigUpCategory {
  id: number;
  name: string;
  description: string;
  points: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}


interface BigUpCategoryDetailsBannerProps {
  bigUpCategory: BigUpCategory
}

export const BigUpCategoryDetailsBanner: React.FC<BigUpCategoryDetailsBannerProps> = ({
  bigUpCategory,
}) => {
  const theme = useTheme();
  return (
    <Flex
      mb={4}
      p={[0, 0, 4]}
      color={theme.colors.adminBannerColor}
      overflow={"hidden"}
      gap={2}
    >
      <BackButton />
      {/* User Group Icon and Name */}
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
          <Celebration
            fontSize="large"
            sx={{ color: "var(--chakra-colors-primary)" }}
          />
        </Box>
      </FormControl>

      {/* User Group Information */}
      <VStack align="start" ml={4} minW={"300px"} spacing={3}>
        <Flex alignItems="center" gap={2}>
          <Box
            w={"1.4rem"}
            h={"1.4rem"}
            borderRadius="full"
            border={"white 1px solid"}
            bg={bigUpCategory.isActive ? "green.500" : "red.500"}
          />
          <Heading fontWeight={300} size={["sm", "md", "lg"]}>
            {bigUpCategory.name}
          </Heading>
        </Flex>
      </VStack>

      {/* ID, CreatedAt, and UpdatedAt */}
      <VStack
        ml={"auto"}
        alignItems={"end"}
        justifyContent={"flex-start"}
        display={["none", "none", "flex"]}
      >
        <Heading size={["sm", "md", "lg"]} fontWeight={100}>
          ID: {bigUpCategory.id}
        </Heading>
        <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
          <CreateIcon />
          <Text fontSize="xs">
            {moment(bigUpCategory.createdAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
        <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
          <UpdateIcon />
          <Text fontSize="xs">
            {moment(bigUpCategory.updatedAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
      </VStack>
    </Flex>
  );
};
