"use client";

import React from "react";
import {
  Badge,
  Box,
  Flex,
  FormControl,
  Heading,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import { People } from "@mui/icons-material";
import moment from "moment/moment";
import CreateIcon from "@mui/icons-material/Create";
import UpdateIcon from "@mui/icons-material/Update";
import BackButton from "@/components/BackButton"; // For fallback or general case icon

interface Team {
  id: number;
  name: string;
  description: string;
  customerId: number;
  managerId: number;
  parentTeamId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  uniqueId: string;
  isDepartment: boolean;
  isService: boolean;
}

interface UserTeamDetailsBannerProps {
  team: Team;
}

export const UserTeamDetailsBanner: React.FC<UserTeamDetailsBannerProps> = ({
  team,
}) => {
  // Determine if it's a department or team
  const isDepartment = team.parentTeamId === null;
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
      {/* Team/Department Icon and Name */}
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
          <People
            fontSize="large"
            sx={{ color: "var(--chakra-colors-primary)" }}
          />
        </Box>
      </FormControl>

      {/* Team/Department Information */}
      <VStack align="start" ml={4} minW={"300px"} spacing={3}>
        <Flex alignItems="center" gap={2}>
          <Box
            w={"1.4rem"}
            h={"1.4rem"}
            borderRadius="full"
            border={"white 1px solid"}
            bg={team.isActive ? "green.500" : "red.500"}
          />
          <Heading fontWeight={300} size={["sm", "md", "lg"]}>
            {team.name}
          </Heading>
        </Flex>

        {/* Department or Team Badge */}
        <Badge
          colorScheme={isDepartment ? "purple" : "blue"}
          variant="solid"
          px={2}
          py={1}
          borderRadius="md"
        >
          {isDepartment ? "Department" : "Team"}
        </Badge>
      </VStack>

      {/* Unique ID and Manager ID */}
      <VStack
        ml={"auto"}
        alignItems={"end"}
        justifyContent={"flex-start"}
        display={["none", "none", "flex"]}
      >
        <Heading size={["sm", "md", "lg"]} fontWeight={100}>
          ID: {team.id}
        </Heading>
        <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
          <CreateIcon />
          <Text fontSize="xs">
            {moment(team.createdAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
        <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
          <UpdateIcon />
          <Text fontSize="xs">
            {moment(team.updatedAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
      </VStack>
    </Flex>
  );
};
