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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BackButton from "@/components/BackButton";

interface Workflow {
  id: number;
  name: string;
  description?: string;
  userAccessGroupNames?: string[] | null;
  enableStartNewInUi: boolean;
  startDate?: string | null;
  caCanUpdateStartDate?: boolean;
  noOfDaysLiveAfterStart?: number | null;
  caCanUpdateDuration?: boolean;
  jsAdditionalFileUrl?: string | null;
  cssThemeFileUrl?: string | null;
  sjsThemeFileUrl?: string | null;
  isActive: boolean;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowDetailsBannerProps {
  workflow: Workflow;
}

export const WorkflowDetailsBanner: React.FC<WorkflowDetailsBannerProps> = ({
  workflow,
}) => {
  const theme = useTheme();
  return (
    <Flex
      p={4}
      color={theme.colors.adminBannerColor}
      overflow={"hidden"}
      gap={2}
    >
      <BackButton />
      {/* Workflow Status */}
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
          <AccountTreeIcon
            fontSize="large"
            sx={{ color: "var(--chakra-colors-primary)" }}
          />
        </Box>
      </FormControl>

      {/* Workflow Information */}
      <VStack align="start" ml={4} spacing={3}>
        <Flex alignItems="center" gap={2}>
          <Box
            w={"1.4rem"}
            h={"1.4rem"}
            borderRadius="full"
            border={"white 1px solid"}
            bg={workflow.isActive ? "green.500" : "red.500"}
          />
          <Heading fontWeight={300} size={["sm", "md", "lg"]}>
            {workflow.name}
          </Heading>
        </Flex>
        <Flex alignItems="center" gap={4}>
          {/* Check for jsAdditionalFileUrl */}
          <Flex alignItems="center" gap={1}>
            <Text>JS:</Text>
            {workflow.jsAdditionalFileUrl ? (
              <CheckCircleIcon
                sx={{ color: "var(--chakra-colors-green-500)" }}
              />
            ) : (
              <ErrorOutlineIcon
                sx={{ color: "var(--chakra-colors-red-500)" }}
              />
            )}
          </Flex>

          {/* Check for cssThemeFileUrl */}
          <Flex alignItems="center" gap={1}>
            <Text>CSS:</Text>
            {workflow.cssThemeFileUrl ? (
              <CheckCircleIcon
                sx={{ color: "var(--chakra-colors-green-500)" }}
              />
            ) : (
              <ErrorOutlineIcon
                sx={{ color: "var(--chakra-colors-red-500)" }}
              />
            )}
          </Flex>

          {/* Check for sjsThemeFileUrl */}
          <Flex alignItems="center" gap={1}>
            <Text>SJS:</Text>
            {workflow.sjsThemeFileUrl ? (
              <CheckCircleIcon
                sx={{ color: "var(--chakra-colors-green-500)" }}
              />
            ) : (
              <ErrorOutlineIcon
                sx={{ color: "var(--chakra-colors-red-500)" }}
              />
            )}
          </Flex>
        </Flex>
      </VStack>

      {/* Metadata Information */}
      <VStack
        ml="auto"
        alignItems="end"
        justifyContent="flex-start"
        display={["none", "none", "flex"]}
      >
        <Heading size={["sm", "md", "lg"]} fontWeight={100}>
          ID: {workflow.id}
        </Heading>
        <Flex direction="row" justify="center" align="center" gap={2}>
          <CreateIcon />
          <Text fontSize="sm">
            {moment(workflow.createdAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
        <Flex direction="row" justify="center" align="center" gap={2}>
          <UpdateIcon />
          <Text fontSize="sm">
            {moment(workflow.updatedAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
      </VStack>
    </Flex>
  );
};
