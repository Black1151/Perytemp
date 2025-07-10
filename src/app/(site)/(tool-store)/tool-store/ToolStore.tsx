"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Flex,
  Spinner,
  Text,
  VStack,
  Skeleton,
  HStack,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useUser } from "@/providers/UserProvider";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useTheme } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { ToolCard } from "./ToolCard";
import { ToolConfig } from "./useBasket";
import {MoreToolsComingSoonCard} from "./MoreToolsComingSoonCard";
import { AdditionalServicesCard } from "./AdditionalServicesCard";
import { Header } from "./Header";
import { ManageSubscriptionFab } from "./ManageSubscriptionFab";

interface ToolSelectionPageResponse {
  resource: ToolConfig[];
}

const ToolStore: React.FC = () => {
  const { user } = useUser();
  const { fetchClient } = useFetchClient();
  const theme = useTheme();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [allTools, setAllTools] = useState<ToolConfig[]>([]);

  const skeletonBg1 = transparentize(theme.colors.darkGray[500], 0.2)(theme);
  const skeletonBg2 = transparentize(theme.colors.darkGray[500], 0.4)(theme);

  const isAuthorized = user?.role === "CA" || user?.role === "CL";

  const loadTools = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetchClient<ToolSelectionPageResponse>(
        "/api/toolConfig/allBy",
        { method: "GET" }
      );
      const tools = res?.resource?.filter((t) => t.showInSeeMoreList) || [];
      setAllTools(tools);
    } catch (error) {
      console.error("Failed to load tools:", error);
      toast({
        title: "Error",
        description: "Unable to fetch tools at this time.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTools();
  }, [loadTools]);

  return (
    <VStack spacing={0} align="center" justify="center" w="100%">
      <Header title="Tool Store" />

      {/* All Tools */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 2, xl: 3 }}
        spacing={4}
        width="100%"
        py={[2, 4, 4]}
      >
        {loading
          ? Array.from({ length: 9 }).map((_, i) => (
          <Skeleton
            key={i}
            height="300px"
            startColor={skeletonBg1}
            endColor={skeletonBg2}
            borderRadius="md"
          />
        ))
          : (
          <>
            {allTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
            <MoreToolsComingSoonCard />
            {isAuthorized && <AdditionalServicesCard />}
          </>
        )
        }
        {isAuthorized && <ManageSubscriptionFab />}
      </SimpleGrid>
    </VStack>
  );
};

export default ToolStore;
