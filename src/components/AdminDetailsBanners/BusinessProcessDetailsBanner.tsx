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
import SchemaIcon from "@mui/icons-material/Schema";
import BackButton from "@/components/BackButton";

interface BusinessProcess {
  id: number;
  name: string;
  description: string;
  userAccessGroupNames: string[] | null;
  allowAlwaysEdit: boolean;
  allowBpStartersViewAll: boolean;
  allowElevatedViewAll: boolean;
  startByDefault: boolean;
  bpStartTriggerGv: string | null;
  bpStartTriggerOperator: string | null;
  bpStartTriggerValue: string | null;
  startDate: string | null;
  noOfDaysLiveAfterBpStart: number | null;
  noOfDaysLiveAfterWfStart: number | null;
  caCanUpdateDurationParams: boolean | null;
  globalVariables: string[] | null;
  notificationTriggers: string[] | null;
  formId: number;
  contributorFunctionality: boolean;
  contributorReason: string | null;
  minRequired: number;
  maxRequired: number;
  altContributorTerm: string | null;
  saveAllowed: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  smallIconImageUrl: string | null;
  largeIconImageUrl: string | null;
}

interface BusinessProcessDetailsBannerProps {
  businessProcess: BusinessProcess;
}

export const BusinessProcessDetailsBanner: React.FC<
  BusinessProcessDetailsBannerProps
> = ({ businessProcess }) => {
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
          <SchemaIcon
            fontSize="large"
            sx={{ color: "var(--chakra-colors-primary)" }}
          />
        </Box>
      </FormControl>

      {/* Business Process Information */}
      <VStack align="start" ml={4} spacing={3}>
        <Flex alignItems="center" gap={2}>
          <Box
            w={"1.4rem"}
            h={"1.4rem"}
            borderRadius="full"
            border={"white 1px solid"}
            bg={businessProcess.isActive ? "green.500" : "red.500"}
          />
          <Heading fontWeight={300} size={["sm", "md", "lg"]}>
            {businessProcess.name}
          </Heading>
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
          ID: {businessProcess.id}
        </Heading>
        <Flex direction="row" justify="center" align="center" gap={2}>
          <CreateIcon />
          <Text fontSize="sm">
            {moment(businessProcess.createdAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
        <Flex direction="row" justify="center" align="center" gap={2}>
          <UpdateIcon />
          <Text fontSize="sm">
            {moment(businessProcess.updatedAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
      </VStack>
    </Flex>
  );
};
