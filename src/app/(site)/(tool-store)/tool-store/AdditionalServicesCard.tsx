"use client";

import React from "react";
import { Box, Text, VStack, Button, useTheme } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { transparentize } from "@chakra-ui/theme-tools";
import { DisplaySettings, HomeRepairService, MiscellaneousServices } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export function AdditionalServicesCard() {
  const theme = useTheme();
  const cardBg = transparentize(theme.colors.elementBG, 0.25)(theme);
  const textColor = "white";
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
          <DisplaySettings fontSize="inherit"/>
          <Text fontSize="xl" fontWeight="bold">
            Additional Services
          </Text>
          <Text fontSize="sm" textAlign="center" color={secondaryTextColor}>
            Discover more ways we can help your business grow and succeed.
          </Text>
          <Button variant={"outline"} size={"sm"} bg={cardBg} color={secondaryTextColor} onClick={() => router.push("/tool-store/additional-services")}>Explore Services</Button>
        </VStack>
      </Box>
    </VStack>
  );
} 