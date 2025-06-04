"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Flex,
  Heading,
  useTheme,
  useBreakpointValue,
  HStack,
} from "@chakra-ui/react";
import AddButtonMobile from "@/components/Buttons/AddButtonMobile";
import { useWorkflow } from "@/providers/WorkflowProvider";
import BackButton from "@/components/BackButton";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useRouter } from "next/navigation";
import AddButtonDesktop from "@/components/Buttons/AddButtonDesktop";
import { MenuItem } from "@/components/Sidebars/NavigationSidebar/NavigationMobilePopoutMenu";
import ContextualMenu from "@/components/Sidebars/ContextualMenu";
import { useUser } from "@/providers/UserProvider";

interface DashboardHeaderProps {
  headingText: string;
  canStartWorkflow: boolean;
  startBtnText?: string
  toolUrl: string;
  contextualMenuItems?: MenuItem[];
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  headingText,
  canStartWorkflow,
  startBtnText,
  toolUrl,
  contextualMenuItems,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { toolId, workflowId } = useWorkflow();
  const [ableToStart, setAbleToStart] = useState(
    !!toolId && !!workflowId && canStartWorkflow
  );

  console.log("contexual menu items:", contextualMenuItems)

  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  const { fetchClient } = useFetchClient();
  const router = useRouter();
  const user = useUser()

  const handleStartClick = useCallback(async () => {
    if (!toolId || !workflowId) return;
    try {
      const response = await fetchClient<{ new_wfinstid: string }>(
        "/api/workflows/startWorkflow",
        {
          method: "POST",
          body: {
            p_toolid: toolId,
            p_wfid: workflowId,
          },
          redirectOnError: false,
        }
      );
      if (response?.new_wfinstid) {
        router.push(`${toolUrl}/workflow/${response.new_wfinstid}`);
      }
    } catch (err) {
      console.error("Error starting workflow:", err);
    }
  }, [fetchClient, router, toolId, workflowId, toolUrl]);

  useEffect(() => {
    setAbleToStart(!!toolId && !!workflowId && canStartWorkflow);
  }, [toolId, workflowId, canStartWorkflow]);

  let shouldShowToolGuides = true
  if (user?.user && user.user.role === "PA") {
    shouldShowToolGuides = false
  }

  const theme = useTheme();

  return (
    <Flex
      ref={headerRef}
      align="center"
      justify="flex-start"
      w="full"
      gap={4}
      lineHeight={0}
    >
      <BackButton
        color={theme.fringeCases.dashboardHeader.textcolor}
        prevRoute="/"
      />

      <Heading
        as="h1"
        fontWeight={100}
        color={theme.fringeCases.dashboardHeader.textcolor}
        fontSize={{ base: "2xl", md: "4xl" }}
        fontFamily="Bonfire"
        textAlign="center"
        mt={2}
      >
        {headingText}
      </Heading>

      <HStack ml="auto" spacing={2}>
        {ableToStart && isMobile && (
          <AddButtonMobile onAddButtonClick={handleStartClick} label={startBtnText||"Start"} />
        )}

        {ableToStart && !isMobile && (
          <AddButtonDesktop
            label={startBtnText||"Start"}
            onAddButtonClick={handleStartClick}
          />
        )}

        {contextualMenuItems && shouldShowToolGuides && (
          <ContextualMenu
            menuItems={contextualMenuItems}
          />
        )}
      </HStack>
    </Flex>
  );
};

export default DashboardHeader;
