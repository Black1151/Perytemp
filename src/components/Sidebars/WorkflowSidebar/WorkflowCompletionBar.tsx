"use client";

import React from "react";
import { Flex, Icon, Progress } from "@chakra-ui/react";
import CheckIcon from "@mui/icons-material/Check";
import { EnhancedWorkflowStage } from "./WorkflowSidebar";
import BackButton from "@/components/BackButton";
import { useWorkflow } from "@/providers/WorkflowProvider";

interface WorkflowCompletionBarProps {
  stages: EnhancedWorkflowStage[];
}

const WorkflowCompletionBar: React.FC<WorkflowCompletionBarProps> = ({
  stages,
}) => {
  const validStages = stages.filter((stage) => stage.stageStatus !== "Locked");

  const totalStages = validStages.length;
  const completedStages = validStages.filter(
    (stage) => stage.bpInstStatus === 3
  ).length;
  const completionPercent =
    totalStages === 0 ? 0 : (completedStages / totalStages) * 100;
  const isComplete = completedStages === totalStages;

  const { toolPath } = useWorkflow();

  return (
    <Flex
      align="center"
      w="full"
      py={2}
      gap={2}
      overflow="hidden"
      whiteSpace="nowrap"
    >
      <BackButton
        prevRoute={toolPath ?? "/"}
        color="primaryTextColor"
        iconSize={"small"}
        _hover={{ color: "primary", transform: "translateX(-5px)" }}
        ml={2}
      />
      <Progress
        value={completionPercent}
        colorScheme="green"
        borderRadius="md"
        flexGrow={1}
        height="8px"
      />
      <Icon
        as={CheckIcon}
        color={isComplete ? "green.500" : "gray.300"}
        ml={2}
        fontSize={"x-large"}
      />
    </Flex>
  );
};

export default WorkflowCompletionBar;
