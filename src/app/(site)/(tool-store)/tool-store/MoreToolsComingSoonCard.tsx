"use client";

import React from "react";
import { Box, Text, VStack, useTheme } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { transparentize } from "@chakra-ui/theme-tools";
import { Construction } from "@mui/icons-material";

/**
 * A placeholder card that fits alongside ToolCard components,
 * indicating more tools are coming soon.
 */
export function MoreToolsComingSoonCard() {
  const theme = useTheme();
  const cardBg = transparentize(theme.colors.elementBG, 0.35)(theme);
  const textColor = "white"
  const secondaryTextColor = "whiteAlpha.900";
  const borderColor = transparentize(theme.colors.elementBG, 0.8)(theme);

  return (
    <VStack>
      <Box
        position="relative"
        w="100%"
        border="3px solid"
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        h="full"
        as={motion.div}
        whileHover={{ scale: 1.00 }}
      >
        <VStack
          flex="1"
          p={6}
          bg={cardBg}
          color={textColor}
          justify="center"
          align="center"
          spacing={4}
          fontSize={"45px"}
        >
          <Construction fontSize="inherit"/>
          <Text fontSize="xl" fontWeight="bold">
            More Tools Coming Soon!
          </Text>
          <Text fontSize="sm" textAlign="center" color={secondaryTextColor}>
            We're hard at work building new tools. Stay tuned!
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
}
