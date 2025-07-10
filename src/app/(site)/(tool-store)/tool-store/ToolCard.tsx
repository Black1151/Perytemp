"use client";

import React from "react";
import {
  Box,
  Text,
  VStack,
  Button,
  useTheme,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { Add, Close, Lock, Remove } from "@mui/icons-material";
import { transparentize } from "@chakra-ui/theme-tools";
import { useBasket } from "./useBasket";
import type { ToolConfig } from "./useBasket";
import { motion } from "framer-motion";
import AnimatedTillNumber from "@/components/animations/AnimatedTillNumber";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";

export function ToolCard({ tool }: { tool: ToolConfig }) {
  const { basket, updateBasket, getBasket, removeItemFromBasket } = useBasket();
  const theme = useTheme();
  const toast = useToast();
  const isFree = basket?.isFree;
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { user } = useUser();

  const isAuthorized = user?.role === "CA" || user?.role === "CL";

  const cardBg = theme.colors.elementBG;
  const textColor = theme.colors.primaryTextColor;
  const addBtnBg = transparentize(theme.colors.seduloGreen, 0.6)(theme);
  const addBtnHoverBg = transparentize(theme.colors.seduloGreen, 0.7)(theme);
  const removeBtnBg = "rgb(255, 0, 0, 0.6)";
  const removeBtnHoverBg = "rgb(255, 0, 0, 0.7)";

  const cardVariants = { hover: {} };
  const logoVariants = {
    hover: { scale: 1.05 },
  };

  const isInBasket = basket?.content?.some(
    (item: any) => item.toolConfigUniqueId === tool.uniqueId
  );

  const isOwned = basket?.ownedSubscriptionInfo?.some(
    (item: any) => item.uniqueId === tool.uniqueId
  );

  const handleButtonClick = async () => {
    setLoading(true);
    if (!basket) {
      toast({
        title: "Basket not ready",
        description: "Please wait a moment and try again.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (isInBasket) {
      try {
        const toolBasketUniqueId = basket.content.find(
          (item: any) => item.toolConfigUniqueId === tool.uniqueId
        )?.uniqueId;
        if (!toolBasketUniqueId) {
          throw new Error("Tool not found in basket");
        }
        await removeItemFromBasket(toolBasketUniqueId);

        toast({
          title: "Removed from basket",
          description: `${tool.displayName}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        console.error("Failed to remove from basket:", error);
        toast({
          title: "Error",
          description: error.message || "Could not update basket.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    } else {
      const items: Array<{ toolConfigUniqueId: string }> = Array.isArray(
        (basket as any).items
      )
        ? (basket as any).items
        : (basket as any).content || [];

      const existing = items.map((i) => i.toolConfigUniqueId);
      const updatedSubs = Array.from(new Set([...existing, tool.uniqueId]));

      try {
        await updateBasket({
          subscriptions: updatedSubs,
        });

        // refresh the context state
        await getBasket();

        toast({
          title: `Added ${tool.displayName} to basket`,
          description: (
            <Box
              as="span"
              cursor="pointer"
              onClick={() => router.push('/tool-store/manage-subscription')}
            >
              View Basket
            </Box>
          ),
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        console.error("Failed to add to basket:", error);
        toast({
          title: "Error",
          description: error.message || "Could not update basket.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <VStack>
      <Box
        position="relative"
        w="100%"
        border="3px solid"
        borderColor={cardBg}
        borderRadius="xl"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        h={"full"}
        as={motion.div}
        variants={cardVariants}
        whileHover="hover"
      >
        {/* Locked icon */}
        {!isOwned && (
          <Box position="absolute" px={3} py={3} zIndex={1}>
            <Lock fontSize="small" sx={{ color: textColor }} />
          </Box>
        )}

        {isOwned && (
          <Box
            position="absolute"
            top={24}
            right={0}
            bg={theme.colors.seduloGreen}
            color="white"
            px={12}
            mx={-8}
            py={1}
            fontSize="sm"
            fontWeight="bold"
            textAlign="center"
            transform="rotate(45deg)"
            transformOrigin="top right"
            zIndex={10}
          >
            {isFree ? "FREE TRIAL" : "SUBSCRIBED"}
          </Box>
        )}

        <VStack
          spacing={0}
          align="start"
          p={0}
          bg={cardBg}
          color={textColor}
          borderRadius="md"
          boxShadow="sm"
          flex="1"
          justifyContent="space-between"
          h="full"
        >
          {tool.logoImageUrl ? (
            <VStack
              w="100%"
              justifyContent="center"
              bg={theme.colors.primary}
              py={8}
              border="0px solid"
              borderColor={cardBg}
              borderRadius="md"
              boxShadow="inset 0 4px 10px rgba(0,0,0,0.24)"
            >
              <Box
                h="80px"
                w="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={6}
              >
                <motion.img
                  src={tool.logoImageUrl}
                  alt={tool.displayName}
                  style={{
                    maxHeight: "80px",
                    objectFit: "contain",
                    width: "auto",
                  }}
                  variants={logoVariants}
                />
              </Box>
            </VStack>
          ) : (
            <Box
              h="40px"
              w="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xl" fontWeight="bold">
                {tool.displayName}
              </Text>
            </Box>
          )}

          <VStack
            p={4}
            spacing={4}
            justify="space-between"
            h={"full"}
            align="center"
            w="100%"
          >
            <Text fontSize="sm">{tool.previewText}</Text>

            <HStack spacing={2} align="center" justify="space-between" w="100%">
              {isAuthorized && (
                <HStack spacing={1} align="center">
                  <Text fontSize="md" fontWeight="bold">
                    £
                  </Text>
                  <AnimatedTillNumber
                    value={
                      basket?.isAnnual
                        ? Number(tool.annualPrice)
                        : Number(tool.monthlyPrice)
                    }
                    fontSize="md"
                    duration={0.65}
                  />
                  <Text fontSize="md" fontWeight="bold">
                    /user
                  </Text>
                </HStack>
              )}

              {isOwned ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const url = `${tool.appUrl}?toolId=${tool.id}&wfId=${tool.workflowId}`;
                    router.push(url);
                  }}
                  color={theme.colors.primaryTextColor}
                >
                  Start Tool
                </Button>
              ) : isAuthorized ? (
                <Button
                  size="sm"
                  variant="outline"
                  border="none"
                  color={theme.colors.primaryTextColor}
                  bg={isInBasket ? removeBtnBg : addBtnBg}
                  _hover={{
                    color: "white",
                    backgroundColor: isInBasket
                      ? removeBtnHoverBg
                      : addBtnHoverBg,
                  }}
                  onClick={handleButtonClick}
                  isLoading={loading}
                >
                  {isInBasket ? (
                    <HStack spacing={1} align="center" m={0}>
                      <Remove fontSize="small" />
                      <Text fontSize="sm" color={theme.colors.primaryTextColor}>
                        Remove
                      </Text>
                    </HStack>
                  ) : (
                    <HStack spacing={1} align="center" m={0}>
                      <Add fontSize="small" />
                      <Text fontSize="sm" color={theme.colors.primaryTextColor}>
                        Add
                      </Text>
                    </HStack>
                  )}
                </Button>
              ) : null}
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
}
