"use client";

import React from "react";
import { Box, Text, VStack, useTheme, Link, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { transparentize } from "@chakra-ui/theme-tools";
import { Construction } from "@mui/icons-material";
import { useRouter } from "next/navigation";

/**
 * A placeholder card that fits alongside ToolCard components,
 * indicating more tools are coming soon.
 */
export function MoreToolsComingSoonCard() {
  const theme = useTheme();
  const cardBg = transparentize(theme.colors.elementBG, 0.25)(theme);
  const textColor = "white"
  const secondaryTextColor = "whiteAlpha.900";
  const borderColor = transparentize(theme.colors.elementBG, 0.8)(theme);
  const router = useRouter();

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
        minH="300px"
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
          textAlign={"center"}
        >
          <Construction fontSize="inherit"/>
          <Text fontSize="xl" fontWeight="bold">
            More Tools Coming Soon!
          </Text>
          <Text fontSize="sm" textAlign="center" color={secondaryTextColor}>
            Our team is working hard to build new tools. Stay tuned!
          </Text>
          <Text fontSize="sm" textAlign="center" color={secondaryTextColor}>
            Have something in mind? 
          </Text>
          <Button variant={"outline"} size={"sm"} bg={cardBg} color={secondaryTextColor} onClick={() => router.push("/tool-store/feature-suggestions")}>Let us know</Button>
        </VStack>
      </Box>
    </VStack>
  );
}
