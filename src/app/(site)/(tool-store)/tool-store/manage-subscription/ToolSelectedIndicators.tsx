"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Wrap,
  WrapItem,
  Box,
  Image,
  Text,
  Icon,
  Skeleton,
} from "@chakra-ui/react";
import { Check } from "@mui/icons-material";
import { ToolConfig, SubscriptionInfo } from "../useBasket";
import { useUser } from "@/providers/UserProvider";
import { useFetchClient } from "@/hooks/useFetchClient";

interface ToolSelectedIndicatorsProps {
  subscriptionInfo: SubscriptionInfo[];
}

interface ToolsResponse {
  resource: ToolConfig[];
}

const ToolSelectedIndicators: React.FC<ToolSelectedIndicatorsProps> = ({
  subscriptionInfo,
}) => {
  const [tools, setTools] = useState<ToolConfig[]>([]);
  const user = useUser();
  const { fetchClient } = useFetchClient();
  const [loading, setLoading] = useState(true);

  const loadTools = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetchClient<ToolsResponse>("/api/toolConfig/allBy", {
        method: "GET",
      });
      const visibleTools =
        res?.resource?.filter((t) => t.showInSeeMoreList) || [];
      setTools(visibleTools);
    } catch (error) {
      console.error("Failed to load tools:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTools();
  }, [loadTools]);

  if (loading) {
    return (
      <Wrap spacing={6}>
        {Array.from({ length: 5 }).map((_, index) => (
          <WrapItem key={index}>
            <Box
              w="58px"
              h="58px"
              borderRadius="lg"
              bg="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Skeleton height="100%" width="100%" />
            </Box>
          </WrapItem>
        ))}
      </Wrap>
    );
  }

  return (
    <Wrap spacing={6}>
      {tools.map((tool) => {
        // Check ownership by matching uniqueId
        const isOwned = subscriptionInfo.some(
          (sub) => sub.uniqueId === tool.uniqueId
        );
        return (
          <WrapItem key={tool.uniqueId}>
            <Box position="relative" textAlign="center">
              <Box
                w="64px"
                h="64px"
                borderRadius="lg"
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
                filter={isOwned ? undefined : "grayscale(100%)"}
                opacity={isOwned ? 1 : 0.5}
                transition="filter 0.2s, opacity 0.2s"
              >
                {tool.iconImageUrl ? (
                  <Image
                    src={tool.iconImageUrl}
                    alt={tool.displayName}
                    boxSize="100%"
                    objectFit="contain"
                  />
                ) : (
                  <Box
                    w="100%"
                    h="100%"
                    bg="gray.200"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="sm" color="gray.500">
                      {tool.displayName.charAt(0)}
                    </Text>
                  </Box>
                )}
              </Box>

              {isOwned && (
                <Icon
                  as={Check}
                  color="white"
                  bg="green.500"
                  boxSize={4}
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  borderRadius="full"
                  p={0.5}
                />
              )}
            </Box>
          </WrapItem>
        );
      })}
    </Wrap>
  );
};

export default ToolSelectedIndicators;
